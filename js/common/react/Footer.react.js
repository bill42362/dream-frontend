// Footer.react.js
import React from 'react';
import ClassNames from 'classnames';
import FooterSection from 'footer-section';

class Footer extends React.Component {
    render() {
        const { footer } = this.props;
        return <footer id='footer'>
            <FooterSection {...footer.setting}>
                {footer.contents.map((content, index) => {
                    const dataProps = Object.keys(content.data).reduce((current, dataKey) => {
                        current[`data-${dataKey}`] = content.data[dataKey];
                        return current;
                    }, {});
                    const children = [];
                    if(!!content.imageSrc) {
                        children.push(<img
                            key={children.length} data-image={true} src={content.imageSrc} title={content.imageTitle}
                        />);
                    }
                    if(!!content.iconSrc) {
                        children.push(<img
                            key={children.length} data-icon={true} src={content.iconSrc} title={content.iconTitle}
                        />);
                    }
                    if(!!content.title) {
                        children.push(<span key={children.length} data-title={true}>{content.title}</span>);
                    }
                    if(!!content.description) {
                        children.push(<span key={children.length} data-description={true}>{content.description}</span>);
                    }
                    if(!!content.href) {
                        return <a key={index} {...dataProps} href={content.href}>{children}</a>;
                    } else {
                        if(content.data.copyright) {
                            content.titles.forEach((title, index) => {
                                children.push(<div key={index + children.length}>{title}</div>);
                            });
                        }
                        return <div key={index} {...dataProps} href={content.href}>{children}</div>;
                    }
                })}
            </FooterSection>
        </footer>;
    }
}
module.exports = Footer;
