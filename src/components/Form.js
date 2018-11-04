import React, {Component} from 'react'
import ReactRouterDOM,{withRouter, Link} from 'react-router-dom'
import ReactRedux,{connect} from 'react-redux'

export const Select = withRouter(connect()((props) => {
    return (
        <select defaultValue={props.value} onChange={props.changeEvent} className={props.className}>
            {(props.value?props.list:[]).map((it) => (<option value={it.value} key={it.value}>{it.name}</option>))}
        </select>
    )
}));