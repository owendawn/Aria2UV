import {combineReducers} from 'redux'

import Downloads from './Downloads'
import Global from './Global'
import Waitings from './Waitings'
import Finishs from './Finishs'
import CommandJobs from './CommandJobs'
import GlobalOptions from './GlobalOptions'

export default combineReducers({
    Global,
    Downloads,
    Waitings,
    Finishs,

    CommandJobs,
    GlobalOptions
})