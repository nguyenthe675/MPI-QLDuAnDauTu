import React from 'react'
import ReactTooltip from 'react-tooltip';
import {Link} from 'react-router-dom'
class Index extends React.PureComponent {
    render() {
        const {id, icon, children, link, linkClassName} = this.props;
        let onClick = function () {};
        if (this.props.onClick) onClick = this.props.onClick;

        return (
            [
                link
                ?
                    <Link className={linkClassName} key={'tooltipIcon'} data-tip data-for={id} to={link}>
                        {icon}
                    </Link>
                :
                    <a className={linkClassName} key={'tooltipIcon'} data-tip data-for={id} onClick={onClick}>
                        {icon}
                    </a>,
                <ReactTooltip key={'tooltip'} id={id} effect='solid'>
                    {children}
                </ReactTooltip>
            ]
        );
    }
}

export default (Index);