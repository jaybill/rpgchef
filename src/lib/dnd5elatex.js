import _ from 'lodash';
import DnD5e from './dnd5e';
import MdLatex from './mdlatex';
import path from 'path';

const mdl = new MdLatex();

const markdown = (md) => {
  return mdl.render(md);
};

const templates = {
  document: '\\documentclass[9pt,twoside]{article}\n' +
    '\\usepackage[bg-none]{dnd}\n' +
    '\\usepackage[ngerman]{babel}\n' +
    '\\usepackage{dndcover}\n' +
    '\\usepackage{wallpaper}\n' +
    '\\usepackage{dndsectionscustom}\n' +
    '\\usepackage{dndmonstercustom}\n' +
    '\\usepackage{xltxtra}\n' +
    '\\usepackage{fontspec}\n' +
    '\\usepackage{tikz}\n' +
    '\\usepackage{multicol}\n' +
    '\\usepackage{dndutil}\n' +
    '\\usepackage{enumitem}\n' +
    '\\usepackage[normalem]{ulem}\n' +
    '% Start document\n' +
    '\\begin{document}\n' +
    '<%= cover %>' +
    '\\twocolumn\n' +
    '\\CenterWallPaper{1.0}{rpgchefpaper.jpg}\n' +
    '\\setmainfont{TeX Gyre Bonum}\n' +
    '<%= content %>\n' +
    '<%= endPage %>\n' +
    '\\end{document}\n',
  cover: '\\title{<%= title %>}\n' +
    '\\subtitle{<%= subtitle %>}\n' +
    '\\author{<%= author %>}\n' +
    '\\vv{<%= version %>}\n' +
    '\\coverimage{<%= coverImage %>}\n' +
    '\\makecover\n' +
    '\\setcounter{page}{2}\n',
  image: '\n\\noindent\\includegraphics[width=\\linewidth]{<%= path %>}\n',
  largeImage: '\n\\onecolumn\n' +
    '\\noindent\\includegraphics[width=\\linewidth]{<%= path %>}\n\\twocolumn\n',
  section: '\\section{<%= title %>}\n',
  subsection: '\\subsection{<%= title %>}',
  subsubsection: '\\subsubsection{<%= title %>}',
  commentBox: '\\begin{commentboxcustom}{<%= title %>}\n' +
    '<%= content %>\n' +
    '\\end{commentboxcustom}\n',
  paperBox: '\\begin{paperboxcustom}{<%= title %>}\n' +
    '<%= content %>\n' +
    '\\end{paperboxcustom}\n',
  readAloud: '\\begin{quotebox}\n' +
    '<%= text %>\n' +
    '\\end{quotebox}\n',
  quote: '\\racequote{<%= firstLine %>}{<%= text %>}{<%= attributeTo %>}\n',
  monster: '\\begin{monsterbox}{<%= name  %>}\n' +
    '\t\\textit{<%= size %> <%= raceOrType %>, <%= alignment %>}\\\\\n' +
    '\t\\hline\n' +
    '\t\\basics[%\n' +
    '\tarmorclass = <%= armorclass %>,\n' +
    '\thitpoints  = <%= hitpoints %>,\n' +
    '\tspeed      = <%= speed %>\n' +
    '\t]\n' +
    '\t\\hline\n' +
    '<%= stats %>' +
    '\\hline\n' +
    '<%= details %>' +
    '\\hline\n' +
    '<%= traitsAndActions %>' +
    '\\end{monsterbox}',
  largeMonster: '\\onecolumn\n\\begin{lmonsterbox}{<%= name  %>}\n' +
    '\\begin{multicols}{2}\n' +
    '\t\\textit{<%= size %> <%= raceOrType %>, <%= alignment %>}\\\\\n' +
    '\t\\hlinehalf\n' +
    '\t\\basics[%\n' +
    '\tarmorclass = <%= armorclass %>,\n' +
    '\thitpoints  = <%= hitpoints %>,\n' +
    '\tspeed      = <%= speed %>\n' +
    '\t]\n' +
    '\t\\hlinehalf\n' +
    '<%= stats %>' +
    '\\hlinehalf\n' +
    '<%= details %>' +
    '\\hlinehalf\n' +
    '<%= traitsAndActions %>' +
    '\\end{multicols}\n\\smallskip\n' +
    '\\end{lmonsterbox}\n\\twocolumn\n',
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
  table: '\\begin{dndtable}\n' +
    '<%= rows %>\n' +
    '\\end{dndtable}\n',
  tableHeading: '\\textbf{<%= h %>}',
  columnBreak: '\n\\newpage\n',
  pageBreak: '\n\\clearpage\n',
  text: '<%= text %>\n\n',
  dmGuild: '\\onecolumn\n' +
    '\\noindent\\minipage[c][\\textheight][s]{\\textwidth}\n' +
    '\\setlength{\\parskip}{4mm}\n' +
    '\\vfill\n' +
    '\\noindent\\begin{center}\n' +
    '\\noindent\\includegraphics[width=0.25\\linewidth]{dm.pdf}\n' +
    '\n' +
    'DUNGEONS \\& DRAGONS, D\\&D, Wizards of the Coast, Forgotten Realms, the dragon ampersand, and all other Wizards of the Coast product names, and their respective logos are trademarks of Wizards of the Coast in the USA and other countries.\n' +
    '\n' +
    'This work contains material that is copyright Wizards of the Coast and/or other authors. Such material is used with permission under the Community Content Agreement for Dungeon Masters Guild.\n' +
    '\n' +
    'All other original material in this work is copyright <%= year %> by <%= name %>  and published under the Community Content Agreement for Dungeon Masters Guild.\n' +
    '\\end{center}\n' +
    '\\endminipage\n'
};

class Dnd5eLaTeX {

  constructor() {
    this.getLatexForModule = this.getLatexForModule.bind(this);
    this.createSection = this.createSection.bind(this);
    this.createSubsection = this.createSubsection.bind(this);
    this.createSubSubsection = this.createSubSubsection.bind(this);
    this.createDocument = this.createDocument.bind(this);
    this.createCommentBox = this.createCommentBox.bind(this);
    this.createMonster = this.createMonster.bind(this);
    this.createColumnBreak = this.createColumnBreak.bind(this);
    this.createPageBreak = this.createPageBreak.bind(this);
    this.createImage = this.createImage.bind(this);
    this.createText = this.createText.bind(this);
    this.createQuote = this.createQuote.bind(this);
    this.createReadAloud = this.createReadAloud.bind(this);
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

        case "racequote":
          lt += this.createQuote(s.content.text, s.content.attributeTo);
          break;

        case "quote":
          lt += this.createReadAloud(s.content.text);
          break;

        case "subsection":
          lt += this.createSubsection(s.content.title);
          break;

        case "subsubsection":
          lt += this.createSubSubsection(s.content.title);
          break;

        case "monster":
          lt += this.createMonster(s.content);
          break;

        case "commentbox":
          lt += this.createCommentBox(s.content.title,
            s.content.text, s.content.displayFormat);
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

    let endb;
    if (m.metadata && m.metadata.dmsguild) {
      endb = this.compiled.dmGuild({
        year: m.metadata.copyrightYear || new Date().getFullYear(),
        name: m.metadata.copyrightHolder || m.author || "the author"
      });
    }

    return this.createDocument(lt, cover, endb);
  }

  createText(t) {
    return this.compiled.text({
      text: this.escape(t, true)
    });
  }

  createReadAloud(t) {
    return this.compiled.quote({
      text: this.escape(t, true)
    });
  }

  createQuote(t, a) {
    let fl;
    let tt;



    if (t) {
      const ttt = t.split("\n\n");
      if (ttt.length > 1) {
        fl = ttt.shift();
        tt = ttt.join("\n\n");
      } else {
        fl = t;
      }
    }

    return this.compiled.quote({
      firstLine: this.escape(fl),
      attributeTo: this.escape(a, true),
      text: this.escape(tt)
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

  createSubSubsection(title) {
    return this.compiled.subsubsection({
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

  createDocument(content, cover, endPage) {
    return this.compiled.document({
      content: content,
      cover: cover,
      endPage: endPage
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
      if (c[ddd]) {

        let vvv;
        if (ddd == "challenge") {
          vvv = this.escape(c[ddd]) + " (" + clean.xp + ")";
        } else {
          vvv = this.escape(c[ddd]);
        }

        detaillines.push(this.compiled.monsterDetail({
          key: ddd.toLowerCase(),
          value: vvv || "--"
        }));

      }
    });
    /*
        console.log(detaillines);
        process.exit();
    */
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

  createCommentBox(title, content, format) {

    let f = "paperBox";
    if (format == "comment") {
      f = "commentBox";
    }

    return this.compiled[f]({
      title: this.escape(title),
      content: this.escape(content, true)
    });
  }

}

const dnd5eLaTeX = new Dnd5eLaTeX();
export default dnd5eLaTeX;
