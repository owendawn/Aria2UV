import React,{Component} from 'react'
import './Modal.scss'

class Modal extends Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
        this.props.beforeShow&&this.props.beforeShow();
    }
    onClose(){
        this.props.beforeClose&&this.props.beforeClose();
    }
    onOk(){
        this.props.beforeOK&&this.props.beforeOK();
    }
    render(){
        return(
            <div className={["modal fade",this.props.show?"show":""].join(" ")} id="exampleModalLong" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true"  style={{overflow:"auto"}}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">{this.props.title}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"  onClick={this.onClose.bind(this)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                        <div className="modal-footer">
                            {this.props.beforeOK&&<button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.onOk.bind(this)}>确定</button>}
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.onClose.bind(this)}>关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal;