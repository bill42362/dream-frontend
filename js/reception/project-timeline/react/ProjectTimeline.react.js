// ProjectTimeline.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import ProjectTimelineTimelabel from './ProjectTimelineTimelabel.react.js';
import ProjectTimelineItem from './ProjectTimelineItem.react.js';

class ProjectTimeline extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = { expendedItemIds: [], };
        this.switchExpend = this.switchExpend.bind(this);
    }
    switchExpend(itemId) {
        let expendedItemIds = this.state.expendedItemIds;
        let indexOfExpendItemIds = expendedItemIds.indexOf(itemId);
        if(-1 === indexOfExpendItemIds) {
            expendedItemIds.push(itemId);
        } else {
            expendedItemIds.splice(indexOfExpendItemIds, 1);
        }
        this.setState({expendedItemIds: expendedItemIds});
    }
    componentDidMount() { }
    componentDidUpdate() { }
    render() {
        let items = this.props.timelineItems;
        let pairedItems = [], tempItems = JSON.parse(JSON.stringify(items));
        let i, j, chunk = 2;
        for(i = 0, j = tempItems.length; i < j; i += chunk) {
            pairedItems.push(tempItems.slice(i, i+chunk));
        }
        return <div ref='base' className='project-timeline' >
            <div className='project-timeline-header'>
                <div className='project-timeline-header-start-time'>
                    {Core.getDateStringWithFormat(this.props.startTimestamp, 'YYYY-MM-DD hh:mm:ss')}
                </div>
                專案開始
            </div>
            {pairedItems.map((pairedItem, index) => {
                let firstItemId = 'timelineItem-' + index + '-0';
                let shouldFirstItemExpend = -1 != this.state.expendedItemIds.indexOf(firstItemId);
                let secondItemId = 'timelineItem-' + index + '-1';
                let shouldSecondItemExpend = -1 != this.state.expendedItemIds.indexOf(secondItemId);
                return <div className='project-timeline-pair' key={index} >
                    <div className='project-timeline-item-container'>
                        <div className='project-timeline-item-wrapper'>
                            <ProjectTimelineItem
                                item={pairedItem[0]}
                                picture={this.props.pictures[pairedItem[0].pictureId]}
                                shouldExpend={shouldFirstItemExpend}
                            />
                            <ProjectTimelineTimelabel
                                item={pairedItem[0]} itemComponentId={firstItemId}
                                onSwitchExpend={this.switchExpend}
                            />
                        </div>
                    </div>
                    <div className='project-timeline-middle-line'></div>
                    <div className='project-timeline-item-container second'>
                        {pairedItem[1] && <div className='project-timeline-item-wrapper'>
                            <ProjectTimelineTimelabel
                                item={pairedItem[1]} itemComponentId={secondItemId}
                                onSwitchExpend={this.switchExpend}
                            />
                            <ProjectTimelineItem
                                item={pairedItem[1]}
                                picture={this.props.pictures[pairedItem[1].pictureId]}
                                shouldExpend={shouldSecondItemExpend}
                            />
                        </div>}
                    </div>
                </div>
            })}
        </div>;
    }
}
module.exports = ProjectTimeline;
