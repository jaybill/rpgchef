import React, { Component } from 'react';
import { connect } from 'react-redux';
import { modulePostReset, modulePdfReset, getPdf as doGetPdf, makePdf as doMakePdf, moduleDel as doModuleDel, moduleReset, modulePostFailure, moduleGet as doModuleGet, modulePost as doModulePost, upload as doUpload, uploadReset as doUploadReset, deleteImage as doDeleteImage } from '../actions/module';
import Module from '../../components/Module';
import urijs from 'urijs';
import log from 'loglevel';
import { updatePath } from 'redux-simple-router';

class ModuleContainer extends Component {

  constructor() {
    super();
    this.onPost = this.onPost.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.makePdf = this.makePdf.bind(this);
    this.resetPost = this.resetPost.bind(this);
    this.onUploadImage = this.onUploadImage.bind(this);
    this.uploadReset = this.uploadReset.bind(this);
    this.onDeleteImage = this.onDeleteImage.bind(this);
  }

  onDeleteImage(filename) {
    const {dispatch} = this.props;
    const module = this.props.module.get.payload;
    dispatch(doDeleteImage(filename, module.id));
  }

  uploadReset() {
    const {dispatch} = this.props;
    dispatch(doUploadReset());
  }

  resetPost() {
    const {dispatch} = this.props;
    dispatch(modulePostReset());
  }

  componentWillReceiveProps(newProps) {
    const {dispatch, routing, module} = newProps;
    if (module.del.succeeded) {
      dispatch(updatePath('/app/modules'));
      return;
    }

    if (module.get.failed) {
      dispatch(updatePath('/app/modules'));
      return;
    }

    if (module.getPdf.succeeded && !this._pdfLinkTimeout) {
      this.setState({
        pdfUrl: module.getPdf.payload.pdfUrl
      });
      this._pdfLinkTimeout = window.setTimeout((self, d) => {
        self.setState({
          pdfUrl: null
        });
        d(modulePdfReset());
        window.clearTimeout(this._pdfLinkTimeout);
        this._pdfLinkTimeout = null;
      }, 3000, this, dispatch);
    }
  }

  componentWillMount() {
    const {dispatch, routing} = this.props;
    const uri = new urijs(routing.path);
    const id = parseInt(uri.segment(-1));
    const params = uri.search(true);

    this.setState({
      id: id,
      isNew: params.new
    });
    dispatch(doModuleGet(id));
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    if (this._pdfLinkTimeout) {
      window.clearTimeout(this._pdfLinkTimeout);
    }
    dispatch(moduleReset());
  }

  makePdf(formdata) {
    const {dispatch} = this.props;
    dispatch(doMakePdf(formdata));
  }

  onDelete(id) {
    const {dispatch} = this.props;
    dispatch(doModuleDel(id));
  }

  onPost(formdata) {
    const {dispatch, module} = this.props;
    dispatch(doModulePost(formdata));
  }

  onUploadImage(k, file) {
    const {dispatch} = this.props;
    const module = this.props.module.get.payload;
    const content = module.content;
    let replaces = null;
    if (content && content[k] && content[k].content && content[k].content.filename) {
      replaces = content[k].content.filename;
      log.debug("replacing", replaces);
    }
    dispatch(doUpload(k, file, module.id, replaces));
  }

  render() {
    const self = this;
    const {dispatch, module} = this.props;
    let moduleContent;

    if (module.get.succeeded) {
      moduleContent = module.get.payload;
    }

    return <Module isNew={ this.state.isNew }
             canMakePdf={ !!module.get.payload && !!module.get.payload.content && !!module.get.payload.content.length }
             makePdf={ (id) => self.makePdf(id) }
             onPost={ (formdata) => self.onPost(formdata) }
             onDelete={ (id) => self.onDelete(id) }
             id={ this.state.id }
             working={ module.post.working || module.get.working }
             pdfWorking={ module.getPdf.working || module.makePdf.working }
             pdfUrl={ this.state.pdfUrl }
             module={ moduleContent }
             getPdf={ module.getPdf }
             post={ module.post }
             onUploadImage={ (k, file) => this.onUploadImage(k, file) }
             uploadImage={ module.uploadImage }
             resetPost={ this.resetPost }
             uploadReset={ this.uploadReset }
             del={ module.del }
             onDeleteImage={ this.onDeleteImage } />;
  }
}

function select(state) {
  return {
    module: state.app.module,
    routing: state.routing
  };
}

export default connect(select)(ModuleContainer);
