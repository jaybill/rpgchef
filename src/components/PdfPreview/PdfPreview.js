import './PdfPreview.less';
import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap';
import log from 'loglevel';
import PDF from 'react-pdf';
import Loading from '../Loading';

export default class PdfPreview extends Component {

  constructor() {
    super();
    this.state = {
      pages: 0,
      currentPage: 0
    };
    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.onDocumentComplete = this.onDocumentComplete.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.pdfUrl) {
      this.setState({
        pdfUrl: newProps.pdfUrl
      });
    }
  }

  onDocumentComplete(pages) {
    log.debug("loaded " + pages + " pages");
    this.setState({
      pages: pages,
      currentPage: 1
    });
  }

  prevPage() {
    log.debug("going to prev page. currentPage", this.state.currentPage);
    this.setState({
      currentPage: this.state.currentPage > 1 ? this.state.currentPage - 1 : 1
    });
  }
  nextPage() {
    log.debug("going to prev next. currentPage", this.state.currentPage);
    if (this.state.currentPage < this.state.pages)
      this.setState({
        currentPage: this.state.pages < this.state.pages ? this.state.currentPage + 1 : this.state.pages
      });
  }

  render() {

    let prevClass;
    let nextClass;
    let wtr;
    if (this.state.pdfUrl) {
      const pdfProps = {
        onDocumentComplete: this.onDocumentComplete,
        scale: 0.6,
        file: this.state.pdfUrl
      };
      if (this.state.pages != 0) {
        log.debug("enabling pages!");
        pdfProps.page = this.state.currentPage;
      }

      wtr = (<div className="PdfPreview">
               <i onClick={ this.prevPage } className="fa fa-arrow-left fa-fw fa-5x"></i>
               <PDF {...pdfProps} />
               <i onClick={ this.nextPage } className="fa fa-arrow-right fa-fw fa-5x"></i>
             </div>);
    } else {
      wtr = <div className="pdfLoading">
              <Loading/>
            </div>;
    }
    return (
      <Modal className="modal-narrow" show={ this.props.modalOpen } onHide={ this.props.onHide }>
        <Modal.Header closeButton>
          <Modal.Title>
            PDF Preview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { wtr }
        </Modal.Body>
      </Modal>
      );
  }
}
