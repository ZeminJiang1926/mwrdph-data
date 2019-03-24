import moment from 'moment';
import 'moment/locale/zh-cn'

function timeFromNow(timestamp){
    return moment(timestamp).fromNow();
}

export default timeFromNow;
