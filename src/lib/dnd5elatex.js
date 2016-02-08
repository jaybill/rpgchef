import _ from 'lodash';
import Latex from 'latex';
import DnD5e from './dnd5e';

const templates = {

  document: '\\documentclass[10pt]{article}\n' +
    '\\usepackage{dnd}\n' +
    '% Start document\n' +
    '\\begin{document}\n' +
    '\\begin{multicols}{2}\n' +
    '\\fontfamily{ppl}\\selectfont % Set text font\n' +
    '<%= content %>\n' +
    '\\end{multicols}\n' +
    '\\end{document}\n',

  section: '\\section*{<%= title %>}\n',
  subsection: '\\subsection*{<%= title %>}',
  commentBox: '    \\begin{commentbox}{<%= title %>}\n' +
    '    <%=content %>\n' +
    '    \\end{commentbox}\n',
  monster: '\\begin{monster}{<%= name  %>}{<%= size %> <%= raceOrType %>, <%= alignment %>}' +
    '\\basics[%\n' +
    'armorclass = <%= armorclass %>,\n' +
    'hitpoints  = <%= hitpoints %>,\n' +
    'speed      = <%= speed %>\n' +
    ']\n' +
    '\\hline\n' +
    '<%= stats %>' +
    '\\hline\n' +
    '<%= details %>' +
    '\\hline\n' +
    '<%= traitsAndActions %>' +
    '\\end{monster}\n',
  monsterStats: '\\stats[\n' +
    '<%= statlines %>' +
    ']\n',
  monsterStat: '<%= stat %> = <%= val %>\n',
  monsterDetails: '\\details[%\n' +
    '<%= detaillines %>' +
    ']\n',
  monsterDetail: '<%= key %> = {<%= value %>},\n',
  monsterSection: '\\monstersection{<%= title %>}\n',
  monsterAction: '\\begin{monsteraction}[<%= name %>]\n' +
    '<%= content %>' +
    '\\end{monsteraction}\n',
  legendaryActions: '\\monstersection{Legendary Actions}\n' +
    "The <%= name%> can take <%= points  %> legendary action<%= s%>, " +
    "choosing from the options below. Only one legendary action option " +
    "can be used at a time and only at the end of another creature's turn. " +
    "The <%= name %> regains spent legendary actions at the start of its turn.\n" +
    "\\newline\n\\newline\n"
};

class Dnd5eLaTeX {

  constructor() {
    this.getLatexForJSON = this.getLatexForJSON.bind(this);
    this.createSection = this.createSection.bind(this);
    this.createSubsection = this.createSubsection.bind(this);
    this.createDocument = this.createDocument.bind(this);
    this.createCommentBox = this.createCommentBox.bind(this);
    this.createMonster = this.createMonster.bind(this);
    this.makePdf = this.makePdf.bind(this);
    this.dd = new DnD5e();
    this.compiled = {};
    _.forEach(_.keys(templates), (k) => {
      this.compiled[k] = _.template(templates[k]);
    });
  }

  makePdf(j) {
    return Latex(this.getLatexForJSON(j));
  }

  getLatexForJSON(j) {
    let lt = "";
    _.forEach(j, (s) => {

      switch (s.type) {
        case "section":
          lt += this.createSection(s.content.title);
          break;

        case "text":
          lt += s.content.text;
          break;

        case "subsection":
          lt += this.createSubsection(s.content.title);
          break;

        case "monster":
          lt += this.createMonster(s.content);
          break;

        case "commentbox":
          lt += this.createCommentBox(s.content.title,
            s.content.text);
          break;
      }
    });

    return this.createDocument(lt);
  }

  createSubsection(title) {
    return this.compiled.subsection({
      title: title
    });
  };


  createDocument(content) {
    return this.compiled.document({
      content: content
    });
  }

  createSection(title) {
    return this.compiled.section({
      title: title
    });
  }

  createMonster(c) {
    const self = this;
    const clean = {
      "xp": c.xp || 0,
      "name": c.name || "Unnamed Horror",
      "size": c.size || "Tiny",
      "speed": c.speed || "--",
      "alignment": c.alignment || "Unaligined",
      "hitpoints": c.hitpoints || null,
      "armorclass": c.armorclass || "--",
      "raceOrType": c.raceOrType || "humanoid"
    };

    const ds = [
      "skills",
      "damageImmunities",
      "savingThrows",
      "conditionImmunities",
      "damageResistances",
      "damageVulnerabilities",
      "senses",
      "languages",
      "challenge"];

    const detaillines = [];

    ds.forEach((ddd, i) => {
      if (c[ddd] || c[ddd] == "languages" || c[ddd] == "senses" || c[ddd] == "challenge") {
        detaillines.push(this.compiled.monsterDetail({
          key: ddd.toLowerCase(),
          value: c[ddd] || "--"
        }));
      }
    });

    clean.details = this.compiled.monsterDetails({
      detaillines: detaillines
    });

    const cs = this.dd.getCoreStats();
    const statlines = [];

    cs.forEach((ccc, i) => {
      if (c[ccc] != 10) {
        const sv = {};
        sv.stat = ccc;
        let v;
        if (c[ccc] == 0 || isNaN(c[ccc])) {
          v = 0;
        } else {
          v = c[ccc];
        }
        sv.val = v + self.dd.calcModifier(v);
        statlines.push(self.compiled.monsterStat(sv));
      }
    });
    if (statlines.length) {
      clean.stats = this.compiled.monsterStats({
        statlines: statlines
      });
    } else {
      clean.stats = "";
    }

    clean.traitsAndActions = "";

    if (c.traits && c.traits.length) {

      c.traits.forEach((t, i) => {
        clean.traitsAndActions += this.compiled.monsterAction({
          name: t.name || "Trait",
          content: t.content
        });
      });

    }

    if (c.actions && c.actions.length) {
      clean.traitsAndActions += this.compiled.monsterSection({
        title: "Actions"
      });
      c.actions.forEach((a, i) => {
        clean.traitsAndActions += this.compiled.monsterAction({
          name: a.name || "Action",
          content: a.content
        });
      });
    }

    if (c.legendaryPoints > 0 && c.legendaryActions && c.legendaryActions.length) {
      let s = "";
      if (c.legendaryPoints > 1) {
        s = "s";
      }
      clean.traitsAndActions += this.compiled.legendaryActions({
        name: clean.name,
        points: c.legendaryPoints,
        s: s
      });
      c.legendaryActions.forEach((l, i) => {
        clean.traitsAndActions += this.compiled.monsterAction({
          name: l.name || "Legendary Action",
          content: l.content
        });
      });
    }
    return this.compiled.monster(clean);
  }


  createCommentBox(title, content) {
    return this.compiled.commentBox({
      title: title,
      content: content
    });
  }

}

const dnd5eLaTeX = new Dnd5eLaTeX();
export default dnd5eLaTeX;
