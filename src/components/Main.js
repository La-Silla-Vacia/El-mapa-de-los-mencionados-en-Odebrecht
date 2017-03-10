require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import 'whatwg-fetch';
import cx from 'classnames';
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
      importance: [],
      stateOfAttorney: [],
      concreteCaseFilter: 'Todos',
      importanceFilter: 'Todos',
      stateOfAttorneyFilter: 'Todos'
    };

    this.rowCallback = this.rowCallback.bind(this);
    this.switchOption = this.switchOption.bind(this);
    this.switchImportanceOption = this.switchImportanceOption.bind(this);
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
      this.setState({error: 'Could not get the data. Please try again later' + ex});
    });
  }

  formatData(data) {
    const newData = [];
    const concreteCases = ['Todos'];
    const importance = ['Todos'];
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
        importanceOfTalking: item.impactoSiHablara,
        whatCouldHappen: item.loQuePodriaPasar,
        severity: item.gravedad
      };
      newData.push(newItem);

      console.log(newItem);
      if (concreteCases.indexOf(newItem.concreteCase) == -1 && newItem.concreteCase.length) {
        concreteCases.push(newItem.concreteCase);
      }
      if (concreteCases.indexOf(newItem.concreteCase2) == -1 && newItem.concreteCase2.length) {
        concreteCases.push(newItem.concreteCase2);
      }
      if (importance.indexOf(newItem.importanceOfTalking) == -1) {
        if (newItem.importanceOfTalking) importance.push(newItem.importanceOfTalking);
      }
      if (stateOfAttorney.indexOf(newItem.stateOfAttorney) == -1) {
        stateOfAttorney.push(newItem.stateOfAttorney);
      }
    });
    this.setState({
      data: newData,
      loading: false,
      concreteCases: concreteCases,
      importance: importance,
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

      if (this.state.concreteCaseFilter !== item.concreteCase &&
        this.state.concreteCaseFilter !== item.concreteCase2) {
        if (this.state.concreteCaseFilter !== 'Todos') return;
      }

      if (this.state.importanceFilter !== item.importanceOfTalking) {
        if (this.state.importanceFilter !== 'Todos') return;
      }

      if (this.state.stateOfAttorneyFilter !== item.stateOfAttorney) {
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

  switchImportanceOption(result) {
    this.setState({importanceFilter: result});
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

    const rows = this.getRows().filter(function (e) {
      return e
    });
    let nothingMessage;
    if (!rows.length && !this.state.loading) {
      nothingMessage = (
        <h3 style={{padding: 16, fontSize: '1.25em'}}>Esta búsqueda no tiene resultados. Por favor seleccione otro
          filtro.</h3>);
    } else if (rows.length && this.state.length) {
      nothingMessage = (<h3 style={{padding: 16, fontSize: '1.25em'}}>Cargando visualización...</h3>);
    }

    return (
      <div className="lsvi_container">

        {/*<h1 className="lsvi_container__title">El mapa de los mencionados en Odebrecht</h1>*/}
        {error}

        <div className="lsvi_container__selects row">
          <div className="section-paz col-sm-4">
            <div className="title"><span>&nbsp;</span>
              <h2>Así quedaron<br />
                los acuerdos</h2>

              <p>Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit
                amet risus. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</p>
            </div>
          </div>

          <div className="col-sm-8 lsvi_container__select-container">

            <div className="lsvi_container__select col-sm-12">
              <h3>Filtre por</h3>
            </div>
            <div className="lsvi_container__select col-sm-12">
              <small>Caso concreto</small>
              <Select
                className='Select'
                value="Todos"
                callback={this.switchOption}
                options={this.state.concreteCases}
              />
            </div>

            <div className="lsvi_container__select col-sm-12">
              <small>Estado en la fiscalía</small>
              <Select
                className="Select"
                value="Todos"
                callback={this.switchAtternoyOption}
                options={this.state.stateOfAttorney}
              />
            </div>

            <div className="lsvi_container__select col-sm-12">
              <small>Importancia de que hable</small>
              <Select
                className='Select'
                value="Todos"
                callback={this.switchImportanceOption}
                options={this.state.importance}
              />
            </div>
          </div>
        </div>

        <div className={cx(
          'PersonRow',
          'lsvi_container__heading'
        )}>
          <div className="PersonRow__columns">
            <div className="PersonRow__column">
              <h2>Nombre</h2>
            </div>
            <div className="PersonRow__column">
              <h2>Estado en la Fiscalía</h2>
            </div>
            <div className="PersonRow__column">
              <h2>Importancia de que hable</h2>
            </div>
          </div>
        </div>

        {nothingMessage}
        {rows}
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
