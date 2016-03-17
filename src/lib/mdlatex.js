import marked from 'marked';
import unescape from 'unescape';

export default class MdLatex {

  constructor() {
    const renderer = new marked.Renderer();
    renderer.code = this.code;
    renderer.blockquote = this.blockquote;
    renderer.html = this.html;
    renderer.heading = this.heading;
    renderer.hr = this.hr;
    renderer.list = this.list;
    renderer.listitem = this.listitem;
    renderer.paragraph = this.paragraph;
    renderer.table = this.table;
    renderer.tablerow = this.tablerow;
    renderer.tablecell = this.tablecell;
    renderer.strong = this.strong;
    renderer.em = this.em;
    renderer.codespan = this.codespan;
    renderer.br = this.br;
    renderer.del = this.del;
    renderer.link = this.link;
    renderer.image = this.image;
    this.renderer = renderer;
  }

  render(md) {
    return unescape(marked(md, {
      renderer: this.renderer
    }));
  }

  code(code, language) {
    return code;
  }

  blockquote(quote) {
    return quote;
  }

  html(html) {
    return "";
  }

  heading(text, level) {
    return text;
  }

  hr() {
    return "";
  }

  list(body, ordered) {
    const listType = ordered ? "enumerate" : "itemize";
    return "\n\\begin{" + listType + "}[leftmargin=*]\n\\setlength\\itemsep{0mm}\n"
      + body +
      "\n\\end{" + listType + "}\n";
  }

  listitem(text) {
    return "\\item " + text + "\n";
  }

  paragraph(text) {
    return text + "\n\n";
  }

  table(header, body) {
    return "";
  }

  tablerow(content) {
    return "";
  }

  tablecell(content, flags) {
    return "";
  }

  strong(text) {
    return "\\textbf{" + text + "}";
  }

  em(text) {
    return "\\textit{" + text + "}";
  }

  codespan(code) {
    return "";
  }

  br() {
    return "\n";
  }

  del(text) {
    return "\\sout{" + text + "}";
  }

  link(href, title, text) {
    return text;
  }

  image(href, title, text) {
    return "";
  }

}
