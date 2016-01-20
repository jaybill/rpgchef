import _ from 'lodash';
import Latex from 'latex';

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
    '    \\end{commentbox}\n'


};

class Dnd5eLaTeX {

  constructor() {
    this.getLatexForJSON = this.getLatexForJSON.bind(this);
    this.createSection = this.createSection.bind(this);
    this.createSubsection = this.createSubsection.bind(this);
    this.compileTemplate = this.compileTemplate.bind(this);
    this.createDocument = this.createDocument.bind(this);
    this.createCommentBox = this.createCommentBox.bind(this);
    this.makePdf = this.makePdf.bind(this);
  }

  makePdf(j) {
    return Latex(this.getLatexForJSON(j));
  }

  getLatexForJSON(j) {
    let lt = "";
    _.forEach(j.sections, (s) => {

      switch (s.type) {
        case "section":
          lt += this.createSection(s.content.title);
          break;

        case "text":
          lt += s.content.paragraphs.join("\n\n");
          break;

        case "subsection":
          lt += this.createSubsection(s.content.title);
          break;

        case "commentbox":
          lt += this.createCommentBox(s.content.title,
            s.content.paragraphs.join("\n\n"));
          break;
      }
    });

    return this.createDocument(lt);
  }

  createSubsection(title) {
    return this.compileTemplate(templates.subsection, {
      title: title
    });
  };


  createDocument(content) {
    return this.compileTemplate(templates.document, {
      content: content
    });
  }

  createSection(title) {
    return this.compileTemplate(templates.section, {
      title: title
    });
  }

  createCommentBox(title, content) {
    return this.compileTemplate(templates.commentBox, {
      title: title,
      content: content
    });
  }


  compileTemplate(template, content) {
    const compiled = _.template(template);
    return compiled(content);
  }

}

const dnd5eLaTeX = new Dnd5eLaTeX();
export default dnd5eLaTeX;
