import Redux,{combineReducers} from 'redux'

import Downloads from './Downloads'
import Global from './Global'
import Waitings from './Waitings'
import Finishs from './Finishs'
import CommandJobs from './CommandJobs'
import GlobalOptions from './GlobalOptions'
import DownloadErrors from "./DownloadErrors";
import ToDownloadOption from "./ToDownloadOption";
import {Aria2Link} from "./Aria2Link";

export default combineReducers({
    Global,
    Downloads,
    Waitings,
    Finishs,

    ToDownloadOption,

    CommandJobs,
    GlobalOptions,
    DownloadErrors,

    Aria2Link
})