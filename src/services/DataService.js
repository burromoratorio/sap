
import axios from 'axios';
import { AppSettings} from './settings';

export default class DataService {

  constructor() {
    this.baseUrl = AppSettings.API_ENDPOINT;      
  }

  getProfesionales(fecha){
    const url = this.baseUrl+'profesionales?start_date='+fecha;
    return(axios.get(url));
  }
  getTurnosDiaProfesional(dia,profesional){
    const url = this.baseUrl+'turnos-reservados?start_date='+dia+' 00:00&end_date='+dia+' 23:59&profe='+profesional;
    return(axios.get(url));
  }
}
