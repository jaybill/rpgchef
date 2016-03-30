import _ from 'lodash';
import DnD5e from './dnd5e';
import MdLatex from './mdlatex';
import path from 'path';

const mdl = new MdLatex();

const markdown = (md) => {
  return mdl.render(md);
};

const templates = {
  document: '\\documentclass[10pt]{article}\n' +
    '\\usepackage{dnd}\n' +
    '\\usepackage{graphicx}\n' +
    '% Start document\n' +
    '\\begin{document}\n' +
    '<%= cover %>' +
    '\\begin{multicols}{2}\n' +
    '\\fontfamily{ppl}\\selectfont % Set text font\n' +
    '<%= content %>\n' +
    '\\end{multicols}\n' +
    '\\end{document}\n',
  cover: '\\title{<%= title %>}\n' +
    '\\subtitle{<%= subtitle %>}\n' +
    '\\author{<%= author %>}\n' +
    '\\vv{<%= version %>}\n' +
    '\\coverimage{<%= coverImage %>}\n' +
    '\\makecover\n' +
    '\\addtocounter{page}{1}',
  image: '\n\\noindent\\includegraphics[width=\\linewidth]{<%= path %>}\n',
  largeImage: '\n\\end{multicols}' +
    '\\noindent\\includegraphics[width=\\linewidth]{<%= path %>}\\begin{multicols}{2}\n',
  section: '\\section*{<%= title %>}\n',
  subsection: '\\subsection*{<%= title %>}',
  commentBox: '\\begin{commentbox}{<%= title %>}\n' +
    '<%=content %>\n' +
    '\\end{commentbox}\n',
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
  largeMonster: '\\end{multicols}\\begin{largemonster}{<%= name  %>}{<%= size %> <%= raceOrType %>, <%= alignment %>}' +
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
    '\\end{largemonster}\\begin{multicols}{2}\n',
  monsterStats: '\\stats[\n' +
    '<%= statlines %>' +
    ']\n',
  monsterStat: '<%= stat %> = <%= val %>\n',
  monsterDetails: '\\details[%\n' +
    '<%= detaillines %>' +
    ']\n',
  monsterDetail: '<%= key %> = {<%= value %>},\n',
  monsterSection: '\\monstersection{<%= title %>}\n',
  monsterAction: '\\noindent\\begin{monsteraction}[<%= name %>]\n' +
    '<%= content %>' +
    '\\end{monsteraction}\n\n',
  legendaryActions: '\\monstersection{Legendary Actions}\n' +
    "The <%= name%> can take <%= points  %> legendary action<%= s%>, " +
    "choosing from the options below. Only one legendary action option " +
    "can be used at a time and only at the end of another creature's turn. " +
    "The <%= name %> regains spent legendary actions at the start of its turn.\n" +
    "\\newline\n\\newline\n",
  table: '\\begin{dndtable}[<%= cols %>]\n' +
    '<%= rows %>\n' +
    '\\end{dndtable}\n',
  tableHeading: '\\textbf{<%= h %>}',
  columnBreak: '\n\\vfill\\columnbreak\n',
  pageBreak: '\n\\clearpage\n',
  text: '<%= text %>\n\n'
};

class Dnd5eLaTeX {

  constructor() {
    this.getLatexForModule = this.getLatexForModule.bind(this);
    this.createSection = this.createSection.bind(this);
    this.createSubsection = this.createSubsection.bind(this);
    this.createDocument = this.createDocument.bind(this);
    this.createCommentBox = this.createCommentBox.bind(this);
    this.createMonster = this.createMonster.bind(this);
    this.createColumnBreak = this.createColumnBreak.bind(this);
    this.createPageBreak = this.createPageBreak.bind(this);
    this.createImage = this.createImage.bind(this);
    this.createText = this.createText.bind(this);
    this.dd = new DnD5e();

    this.compiled = {};
    _.forEach(_.keys(templates), (k) => {
      this.compiled[k] = _.template(templates[k]);
    });
  }

  escape(t, parseMarkdown) {
    // THE ORDER OF REPLACEMENT MATTERS
    /*
     Because some of the characters in the replacements need to be escaped in the content, 
     it's super important to replace the brackets first with something else entirely, then 
     escape the slashes (the replacement uses brackets) and then convert @OPEN and @CLOSE 
     back into brackets.

     Also: I am _sure_ there is a better way to do this, I'm just not sure what that is.
     */
    let o;
    if (t) {
      o = _.chain(t)
        .replace(/{/g, '@OPEN')
        .replace(/}/g, '@CLOSE')
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/@OPEN/g, '\\{')
        .replace(/@CLOSE/g, '\\}')
        .replace(/\^/g, '\\textasciicircum{}')
        .thru((tt) => {
          return parseMarkdown ? markdown(tt) : tt;
        })
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/#/g, '\\#')
        .replace(/\$/g, '\\$')
        .replace(/%/g, '\\%')
        .replace(/&/g, '\\&')
        .replace(/_/g, '\\_')
        .value();
    }
    return o;
  }


  getLatexForModule(m, imagePath) {
    let lt = "";
    const j = m.content;

    _.forEach(j, (s) => {

      switch (s.type) {
        case "section":
          lt += this.createSection(s.content.title);
          break;

        case "table":
          lt += this.createTable(s.content.data);
          break;

        case "text":
          lt += this.createText(s.content.text);
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

        case "columnbreak":
          lt += this.createColumnBreak();
          break;
        case "pagebreak":
          lt += this.createPageBreak();
          break;

        case "image":
          lt += this.createImage(s.content.filename, s.content.displaySize, imagePath);
          break;

      }
    });
    let cover;
    if (m.hasCover && m.coverUrl) {
      cover = this.compiled.cover({
        title: m.name,
        subtitle: m.subtitle,
        author: "by " + (m.author || "Anonymous"),
        version: m.version ? "Version " + m.version : null,
        coverImage: path.join(imagePath, m.coverUrl)
      });
    }
    return this.createDocument(lt, cover);
  }

  createText(t) {
    return this.compiled.text({
      text: this.escape(t, true)
    });
  }

  createColumnBreak() {
    return this.compiled.columnBreak({});
  }

  createPageBreak() {
    return this.compiled.pageBreak({});
  }

  createImage(filename, displaySize, imagePath) {
    let t;

    switch (displaySize) {
      case "large":
        t = "largeImage";
        break;
      default:
        t = "image";
        break;
    }


    return this.compiled[t]({
      path: path.join(imagePath, filename)
    });
  }

  createSubsection(title) {
    return this.compiled.subsection({
      title: this.escape(title)
    });
  };

  createTable(data) {
    if (data[0] && data[0].length) {
      const rows = [];
      const headingRows = [];
      _.forEach(data[0], (r) => {
        headingRows.push(this.compiled.tableHeading({
          h: this.escape(r)
        }));
      });

      rows.push(headingRows.join("\t&\t"));

      for (let i = 1; i < data.length; i++) {
        data[i].map(this.escape);
        rows.push(data[i].join("\t&\t"));
      }

      return this.compiled.table({
        cols: data[0].length,
        rows: rows.join(' \\\\\n')
      });
    } else {
      return "";
    }
  };

  createDocument(content, cover) {
    return this.compiled.document({
      content: content,
      cover: cover
    });
  }

  createSection(title) {
    return this.compiled.section({
      title: this.escape(title)
    });
  }

  createMonster(c) {
    const self = this;
    const clean = {
      "xp": this.escape(c.xp) || 0,
      "name": this.escape(c.name) || "Unnamed Horror",
      "size": this.escape(c.size) || "Tiny",
      "speed": this.escape(c.speed) || "--",
      "alignment": this.escape(c.alignment) || "Unaligined",
      "hitpoints": this.escape(c.hitpoints) || null,
      "armorclass": this.escape(c.armorclass) || "--",
      "raceOrType": this.escape(c.raceOrType) || "humanoid"
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
          value: this.escape(c[ddd]) || "--"
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
          name: this.escape(t.name) || "Trait",
          content: this.escape(t.content, true)
        });
      });

    }

    if (c.actions && c.actions.length) {
      clean.traitsAndActions += this.compiled.monsterSection({
        title: "Actions"
      });
      c.actions.forEach((a, i) => {
        clean.traitsAndActions += this.compiled.monsterAction({
          name: this.escape(a.name) || "Action",
          content: this.escape(a.content, true)
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
        points: this.escape(c.legendaryPoints),
        s: s
      });
      c.legendaryActions.forEach((l, i) => {
        clean.traitsAndActions += this.compiled.monsterAction({
          name: this.escape(l.name) || "Legendary Action",
          content: this.escape(l.content, true)
        });
      });
    }
    let dds;
    if (c.displaySize == "large") {
      dds = "largeMonster";
    } else {
      dds = "monster";
    }

    return this.compiled[dds](clean);
  }


  createCommentBox(title, content) {
    return this.compiled.commentBox({
      title: this.escape(title),
      content: this.escape(content)
    });
  }

}

const dnd5eLaTeX = new Dnd5eLaTeX();
export default dnd5eLaTeX;
