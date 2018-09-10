import React,{Component} from 'react'
import {withRouter,Link} from 'react-router-dom'
import {connect}from 'react-redux'

export const Select=withRouter(connect()((props)=>(
    <select defaultValue={props.value}>
        {props.list.map((it)=>(<option value={it.value}  key={it.value}>{it.name}</option>))}
    </select>
)));