// ProjectTimelineItem.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';

class ProjectTimelineItem extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
    }
    componentDidMount() {}
    componentDidUpdate() {}
    render() {
        let item = {
            content: 'item content item content item content item content item content item content ',
            medias: [
                {
                    type: 'image', title: '新城國小',
                    src: "http://dream.pbplus.me/wp-content/uploads/2016/03/DSCN8334.jpg",
                },
                {
                    type: 'image', title: '新城國小',
                    src: "http://dream.pbplus.me/wp-content/uploads/2016/03/DSCN8334.jpg",
                },
            ],
        };
        return <div ref='base' className='project-timeline-item row' >
            <p className='project-timeline-item-content' dangerouslySetInnerHTML={{__html: item.content}}></p>
            <div className='project-timeline-item-medias'>
                Medias
            </div>
        </div>;
    }
}
module.exports = ProjectTimelineItem;
