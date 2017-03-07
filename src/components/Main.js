require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import 'whatwg-fetch';
import Select from './SelectComponent';
import PersonRow from './PersonRowComponent';

class AppComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      data: [],
      loading: true,
      error: false,
      openRow: {},
      concreteCases: [],
      mentions: [],
      stateOfAttorney: [],
      concreteCaseFilter: '',
      mentionsFilter: '',
      stateOfAttorneyFilter: ''
    };

    this.rowCallback = this.rowCallback.bind(this);
    this.switchOption = this.switchOption.bind(this);
    this.switchMentionsOption = this.switchMentionsOption.bind(this);
    this.switchAtternoyOption = this.switchAtternoyOption.bind(this);
  }

  componentWillMount() {
    this.getData();
  }

  getData() {
    fetch('https://mencionados-en-odebrecht.firebaseio.com/data.json')
      .then((response) => {
        return response.json()
      }).then((json) => {

      this.formatData(json);
    }).catch((ex) => {
      console.log('parsing failed', ex);
      this.setState({error: 'Could not get the data. Please try again later'});
    });
  }

  formatData(data) {
    const newData = [];
    const concreteCases = ['Todos'];
    const mentions = ['Todos'];
    const stateOfAttorney = ['Todos'];

    data.map((item) => {

      let photo = item.foto;
      if (!photo) {
        photo = 'http://archivo.lasillavacia.com/archivos/historias/clientelismo2017/padrinos/36.jpg';
      }

      let newItem = {
        name: item.nombre,
        photo: photo,
        bio: item.quienEs,
        concreteCase: item.casoConcreto,
        concreteCase2: item.casoConcreto2,
        mentions: item.mencionados,
        stateOfAttorney: item.estadoEnLaFiscalia,
        scandalRelationship: item.relacionConElEscandalo,
        importanceOfTalking: item.importanciaDeQueHable,
        whatCouldHappen: item.loQuePodriaPasar,
        severity: item.gravedad
      };
      newData.push(newItem);

      if (concreteCases.indexOf(newItem.concreteCase) == -1 && newItem.concreteCase.length) {
        concreteCases.push(newItem.concreteCase);
      }
      if (concreteCases.indexOf(newItem.concreteCase2) == -1 && newItem.concreteCase2.length) {
        concreteCases.push(newItem.concreteCase2);
      }
      if (mentions.indexOf(newItem.mentions) == -1) {
        mentions.push(newItem.mentions);
      }
      if (stateOfAttorney.indexOf(newItem.stateOfAttorney) == -1) {
        stateOfAttorney.push(newItem.stateOfAttorney);
      }
    });
    this.setState({
      data: newData,
      loading: false,
      concreteCases: concreteCases,
      mentions: mentions,
      stateOfAttorney: stateOfAttorney
    });
  }

  rowCallback(id, type) {
    let setTo = {id, type};
    if (this.state.openRow.id == id) setTo = {};
    this.setState({openRow: setTo});
  }

  getRows() {
    return this.state.data.map((item, index) => {
      let open = false;

      if (this.state.openRow) {
        if (this.state.openRow.id == index + 1) {
          open = this.state.openRow
        }
      }

      if (this.state.concreteCaseFilter
        && (this.state.concreteCaseFilter !== item.concreteCase && this.state.concreteCaseFilter !== item.concreteCase2)) {
        if (this.state.concreteCaseFilter !== 'Todos') return;
      }

      if (this.state.mentionsFilter && this.state.mentionsFilter !== item.mentions) {
        if (this.state.mentionsFilter !== 'Todos') return;
      }

      if (this.state.stateOfAttorneyFilter && this.state.stateOfAttorneyFilter !== item.stateOfAttorney) {
        if (this.state.stateOfAttorneyFilter !== 'Todos') return;
      }

      return (
        <PersonRow
          {...item}
          open={open}
          id={index + 1}
          callback={this.rowCallback}
          key={index}
        />
      )
    });
  }

  switchOption(result) {
    this.setState({concreteCaseFilter: result});
  }

  switchMentionsOption(result) {
    this.setState({mentionsFilter: result});
  }

  switchAtternoyOption(result) {
    this.setState({stateOfAttorneyFilter: result});
  }

  render() {
    let error;
    if (this.state.error) {
      error = (
        <h2>{this.state.error}</h2>
      )
    }

    const rows = this.getRows();
    return (
      <div className="lsvi_container">

        <h1 className="lsvi_container__title">El mapa de los mencionados en Odebrecht</h1>
        {error}

        <div className="lsvi_container__selects row">

          <div className="lsvi_container__select col-sm-3">
            <small>Por caso concreto</small>
            <Select
              className='Select'
              value="Todos"
              callback={this.switchOption}
              options={this.state.concreteCases}
            />
          </div>

          <div className="lsvi_container__select col-sm-3">
            <small>Por mencionados</small>
            <Select
              className='Select'
              value="Todos"
              callback={this.switchMentionsOption}
              options={this.state.mentions}
            />
          </div>

          <div className="lsvi_container__select col-sm-3">
            <small>Por estado en la fiscalía</small>
            <Select
              className="Select"
              value="Todos"
              callback={this.switchAtternoyOption}
              options={this.state.stateOfAttorney}
            />
          </div>
        </div>

        {rows}
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
