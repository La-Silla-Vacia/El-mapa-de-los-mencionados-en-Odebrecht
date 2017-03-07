'use strict';
import React from 'react';
import cx from 'classnames';
const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  });
require('styles/PersonRow.scss');

class PersonRowComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      explainerHeight: false
    };

    this.openBio = this.openBio.bind(this);
  }

  openBio() {
    this.props.callback(this.props.id, 'bio');
  }

  render() {
    let importanceOfTalking = this.props.importanceOfTalking;
    if (!importanceOfTalking) importanceOfTalking = 'Sin definir';

    let bio = this.props.bio;
    if (!bio) bio = 'Sin definir';

    return (
      <div className={cx(
        'PersonRow',
        {'PersonRow--open': this.props.open}
      )}>
        <div className="PersonRow__columns" onClick={this.openBio}>
          <button onClick={this.openBio} className="PersonRow__column">
            <div className="PersonRow__inner">
              <figure className={cx(
                'PersonRow__photo-container',
                `PersonRow--severity-${this.props.severity}`
              )}>
                <img className="PersonRow__photo" src={this.props.photo} alt={this.props.name}/>
              </figure>
              <h3 className="PersonRow__heading3">{this.props.name}</h3>
            </div>
          </button>
          {/*<div className="PersonRow__column">*/}
          {/*<div className="PersonRow__inner-text">*/}
          {/*<span className="PersonRow__text">{this.props.concreteCase}</span><br />*/}
          {/*<span className="PersonRow__text">{this.props.concreteCase2}</span>*/}
          {/*</div>*/}
          {/*</div>*/}
          {/*<div className="PersonRow__column">*/}
            {/*<span className="PersonRow__text">{this.props.mentions}</span>*/}
          {/*</div>*/}
          <div className="PersonRow__column">
            <span className="PersonRow__text">{this.props.stateOfAttorney}</span>
          </div>
          <div className="PersonRow__column">
            <span className="PersonRow__text">{this.props.importanceOfTalking}</span>
          </div>
        </div>
        <div className={cx(
          'PersonRow__explainer',
          'row',
          {'PersonRow__explainer--open': this.props.open.type == 'bio'}
        )}>
          <div className="PersonRow__explainer__triangle" />
          <div className="col-sm-7">
            <h3>{this.props.name}</h3>
            <div dangerouslySetInnerHTML={{__html: md.render(bio)}}>
            </div>
          </div>
          <div className="col-sm-5">
            <ul className="PersonRow__explainer__meaning">
              <li className="PersonRow__explainer__item">
                <h6>Estado en la fiscalía</h6>
                <span className={cx(
                  `PersonRow--severity-${this.props.severity}`
                )}/>
                {this.props.stateOfAttorney}
              </li>
              <li className="PersonRow__explainer__item">
                <h6>Caso concreto</h6>
                {this.props.concreteCase} <br />
                {this.props.concreteCase2}
              </li>
              <li className="PersonRow__explainer__item">
                <h6>Relación con el escándalo</h6>
                <div dangerouslySetInnerHTML={{__html: md.render(this.props.scandalRelationship)}} />
              </li>
              <li className="PersonRow__explainer__item">
                <h6>Importancia de que hable</h6>
                <div dangerouslySetInnerHTML={{__html: md.render(this.props.importanceOfTalking)}} />
              </li>
              <li className="PersonRow__explainer__item">
                <h6>Lo que podría pasar</h6>
                <div dangerouslySetInnerHTML={{__html: md.render(this.props.whatCouldHappen)}} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

PersonRowComponent.displayName = 'PersonRowComponent';

// Uncomment properties you need
// PersonRowComponent.propTypes = {};
// PersonRowComponent.defaultProps = {};

export default PersonRowComponent;
