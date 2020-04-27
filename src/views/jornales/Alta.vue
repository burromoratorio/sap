<template>
  <div class="animated fadeIn">
    <CRow>
    <CCol sm="6" md="6">
        <CCard>
          <CCardHeader>Formulario calculo de Horas</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="6"><CInput label="Buque" placeholder="Buque:" /></CCol>
              <CCol sm="6"><CInput label="Lugar" placeholder="Lugar:" /></CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <date-picker placeholder="Fecha Inicio:" format="DD-MM-YYYY HH:mm" :minute-step="minutestep" v-model="inicio" type="datetime" ></date-picker>
              </CCol>
              <CCol sm="6">
                <date-picker placeholder="Fecha Fin:" format="DD-MM-YYYY HH:mm" :minute-step="minutestep" v-model="fin" type="datetime"></date-picker>
              </CCol>
            </CRow>
            <CRow>             
              <CCol sm="3"><CInput label="Horas Normales" placeholder="normal" v-model="normal" /></CCol>
              <CCol sm="3"><CInput label="Horas al 50" placeholder="Al 50" v-model="hora50" /></CCol>
              <CCol sm="3"><CInput label="Horas al 100" placeholder="Al 100" v-model="hora100" /></CCol>
              <CCol sm="3"><CInput label="Horas al 125" placeholder="Al 125" v-model="hora125"/></CCol>
            </CRow>
          </CForm>
          </CCardBody>
        </CCard>
        <CCard><CCardHeader>Totales</CCardHeader>
            <CCardBody>
              <CRow>
                  <CCol sm="4">
                    <CInput label="Dias" placeholder="Dias" v-model="dias"/>
                  </CCol>
                  <CCol sm="4">
                    <CInput label="Horas Trabajdas" placeholder="Horas" v-model="totalHoras"/>
                  </CCol>
                  <CCol sm="4">
                    <CInput label="Jornales Trabajados" placeholder="Jornales" v-model="totalJornales"/>
                  </CCol>
              </CRow>
              <CRow class="align-items-center">
                <CCol  sm="6" xl class="mb-3 mb-xl-0">
                  <CButton color="success" shape="pill" size="lg" @click="calculaJornales">Calcular</CButton></CCol>
                <CCol  sm="6" xl class="mb-3 mb-xl-0">
                  <CButton color="primary" shape="pill" size="lg" @click="saveJornales">Guardar</CButton></CCol>
              </CRow>
            </CCardBody>
        </CCard>
    </CCol>
    <CCol sm="6" md="6">
        <CCard>
          <CCardHeader>Formulario Seleccion de Personal</CCardHeader>
          <CCardBody>
          <CForm description="buscar por nombre y apellido" label="Seleccione el Empleado"
             label-for="basicName" :label-cols="3" :horizontal="true">
             <vue-single-select v-model="empleado" :options="empleados" :required="true" option-label="a_title"
              :getOptionDescription="getCustomDescription" option-key="id" @input="buscateEmpleado">
              </vue-single-select>
              <CInput id="tipo" label="Tipo de Empleado" v-model="tipo" horizontal plaintext/>

          </CForm>
          <div slot="footer">
              <CButton type="submit" size="sm" color="primary"><i class="fa fa-dot-circle-o"></i> Submit</CButton>
              <CButton type="reset" size="sm" color="danger"><i class="fa fa-ban"></i> Reset</CButton>
          </div>
          </CCardBody>
        </CCard>
    </CCol>
  </CRow>
  </div>

</template>

<script>
import Vue from 'vue';
import VueSingleSelect from 'vue-single-select';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/es';
import CTableWrapper from '../base/Table.vue'
import DataService from '../../services/DataService';
const dataservice = new DataService();
var turnos = [];

export default {
  components: {
     VueSingleSelect,
     DatePicker
     
    },
    //...
  
  name: 'Alta',
  data () {
    return {
      inicio: null,
      fin: null,
      minutestep:15,
      hora50:0,
      hora100:0,
      hora125:0,
      normal:0,
      totalHoras:0,
      totalJornales:0,
      dias:0,
      topeUnoNormal:6,
      topeDosNormal:18,
      topeTres:12,
      topeCuatro:24,
      fields: [
        {key: 'hora'},
        {key: 'paciente'},
        {key: 'status'}
      ],
      startDate: '',
      primaryModal: false,
      dangerModal: false,
      empleados: [{ id: 1, a_title: "Vince Carter",tipo:"mensual" },{ id: 2, a_title: "Kareem Abdul Jabbar",tipo:"mensual" },
                 { id: 3, a_title: "Charles Barkley",tipo:"jornal"},{ id: 4, a_title: "Isaiah Thomas",tipo:"jornal" }],
      empleado:'',
      tipo:''
    }
  },
  created () {
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
   //this.search(equipo_id);
  },
  /*mounted() {
      $("#fecha").datepicker().on(
        "changeDate", () => {this.startDate = $('#fecha').val()}
      );
    },*/
  methods: {
    calculaJornales(){
      var diaIni=this.inicio.getDay();
      var horaIni=this.inicio.getHours();
      var diaFin=this.fin.getDay();
      var horaFin=this.fin.getHours();
      if(diaIni==diaFin){
        var cantHoras=this.obtenerTipoDeJornal(horaIni,horaFin,diaIni);
        this.normal=cantHoras['normal'];
        this.hora50=cantHoras['extra50'];
        this.hora100=cantHoras['extra100'];
        this.hora125=cantHoras['extra125'];
        this.dias=1;
        this.totalJornales=1;
      }
      this.totalHoras=(parseInt(this.hora) + parseInt(this.mediaH) +  parseInt(this.horaPico));
    },
    saveJornales(){
      alert('Guardando datos...');
    },
    obtenerTipoDeJornal(hIni,hFin,dia){
      var totalesHoras  ={normal: 0,extra50: 0,extra100: 0,extra125: 0};
      if(1<=dia<=5){//lunes a viernes
        totalesHoras  = this.calculaHorasSemana(hIni,hFin);
      }
      if(dia==6){
        totalesHoras  = this.calculaHorasSabado(hIni,hFin);
      }
      if(dia==7){
        totalesHoras  = this.calculaHorasDomingo(hIni,hFin);
      }
      return totalesHoras;
    },
    calculaHorasSemana(hIni,hFin){
      var totales={normal: 0,extra50: 0,extra100: 0,extra125: 0};
      if(hIni>=this.topeUnoNormal && hIni<this.topeDosNormal && hFin<=this.topeDosNormal){
          totales['normal']=(hFin-hIni);
        }
        if(hIni<this.topeUnoNormal && hFin>=this.topeUnoNormal && hFin<=this.topeDosNormal){//00 a 06 y 06 a 18 am
          totales['extra50']=(this.topeUnoNormal-hIni);
          totales['normal']=(hFin-this.topeUnoNormal);
        }
        if(hIni<this.topeUnoNormal && hFin<=this.topeUnoNormal){//00 a 06 
          totalesHoras['extra50']=(hFin-hIni);
        }
        if(this.topeUnoNormal<=hIni && hIni<=this.topeDosNormal && hFin>=this.topeDosNormal){//06 a 18 y 18 a 24
          totales['normal']=(this.topeDosNormal-hIni);
          totales['extra50']=(hFin-this.topeDosNormal);
        }
        if(this.topeDosNormal<=hFin && this.topeDosNormal<=hFin){
          totales['extra50']=(hFin-hIni);
        }
      return totales;
    },
    /*topeUnoNormal:6,
      topeDosNormal:18,
      topeTres:12,
      topeCuatro:24,*/
    calculaHorasSabado(hIni,hFin){
      var totales={normal: 0,extra50: 0,extra100: 0,extra125: 0};
      var rango=0;
      if(0<hIni<6 && hFin<=6){
        totales['extra50']=hFin-hIni;
      }
      if(0<hIni<6 && 6<hFin<=12){
        totales['extra50']=6-hIni;
        totales['normal']=hFin-6;
      }
      if(0<hIni<6 && 12<hFin<24){
        totales['extra50']=6-hIni;
        totales['normal']=6;
        totales['extra100']=hFin-12;
      }
      if(6<hIni<=12 && 6<hFin<=12){
        totales['normal']=6;
      }
      if(6<hIni<=12 && 12<hFin<24){
        totales['normal']=6;
        totales['extra100']=hFin-12;
      }
    },
    calculaHorasDomingo(hIni,hFin){
      var totales={normal: 0,extra50: 0,extra100: 0,extra125: 0};
    },
    fetchEmpleados (fechita) {
      this.show = true;
      this.fecha=fechita;
      this.profesionales  =[
            {value: '1', text:'Sandro de America'},
            {value: '2', text:'Ezequiel pindonga'},
            {value: '3', text:'Pija Dura'},
            {value: '4', text:'Caca de Perro'},
            {value: '5', text:'Gordo Porcel'}
        ];
        this.profesional=this.profesionales[0].value;
      /*dataservice.getProfesionales().then( result => {
        if(result.status==200){
          this.profesionales = result.data.results.map(function(obj){
            var obj_select = {};
            obj_select.value = obj.id;
            obj_select.text = obj.apellido+","+obj.nombre;
            return(obj_select)
          })
          this.profesional=this.profesionales[0].value;
        }
      },
      (error) => {
        
      })*/
      
    },
    
    getBadge (status) {
      return status === 'Active' ? 'fa fa-calendar-minus-o'
        : status === 'Inactive' ? 'fa fa-calendar-plus-o'
        : status === 'Pending' ? 'fa fa-pencil': 'fa fa-calendar-minus-o'
         
    },
    getRowCount (items) {
      return items.length
    },
    cambiando(prof){
      this.profesional=prof;
      
      /*dataservice.getTurnosDiaProfesional(this.fecha,prof).then( result => {
        if(result.status==200){
          console.log(result.data);
        }
      },
      (error) => {
        //this.showAlert();
        //this.disabled=1;
      })*/



           this.turnos  =[
            {hora: '08:00', paciente:'Sandro de America', status:'Active'},
            {hora: '08:15', paciente:'Sandro de America', status:'Pending'},
            {hora: '08:30', paciente:'Sandro de America', status:'Active'},
            {hora: '08:45', paciente:'', status:'Inactive'},
            {hora: '09:00', paciente:'Sandro de America', status:'Active'},
            {hora: '09:15', paciente:'Sandro de America', status:'Active'},
            {hora: '09:30', paciente:'Sandro de America', status:'Pending'},
            {hora: '09:45', paciente:'', status:'Inactive'},
            {hora: '10:00', paciente:'Sandro de America', status:'Pending'},
            {hora: '10:15', paciente:'Sandro de America', status:'Active'},
            {hora: '10:30', paciente:'Sandro de America', status:'Active'},
            {hora: '10:45', paciente:'', status:'Inactive'},
            {hora: '11:00', paciente:'Sandro de America', status:'Inactive'},
            {hora: '11:15', paciente:'', status:'Inactive'},
            {hora: '11:30', paciente:'Sandro de America', status:'Active'},
            {hora: '11:45', paciente:'Sandro de America', status:'Active'},
            {hora: '12:00', paciente:'Sandro de America', status:'Active'},
            {hora: '12:15', paciente:'Sandro de America', status:'Active'},
            {hora: '12:30', paciente:'Sandro de America', status:'Pending'},
            {hora: '12:45', paciente:'Sandro de America', status:'Active'},
            {hora: '13:00', paciente:'', status:'Inactive'},
            {hora: '13:15', paciente:'', status:'Inactive'},
            {hora: '13:30', paciente:'Sandro de America', status:'Active'},
            {hora: '13:45', paciente:'Sandro de America', status:'Active'}
        
        ];
      },
      activModal(status){
        //obtener profesional y fecha de los otros input
        switch (status) {
          case "Active":
            //pregunto si quiere eliminar el turno
            console.log('idProfesional:'+this.profesional+ 'fecha:'+this.startDate);
        
            this.dangerModal=true;
            break;
          case "Inactive":
          //traigo pacientes y para asignar a ese turno
            this.empleados= [{ id: 1, a_title: "baz bar" },{ id: 2, a_title: "foo bar" },
                 { id: 3, a_title: "Eos rerum veniam quia mollitia"},{ id: 4, a_title: "Robs Thread" }];
            this.primaryModal=true;
            break;
          case "Pending":
            //traigo pacientes y permito editar el turno
            this.empleados= [{ id: 1, a_title: "baz bar" },{ id: 2, a_title: "foo bar" },
                 { id: 3, a_title: "Eos rerum veniam quia mollitia"},{ id: 4, a_title: "Robs Thread" }];
            this.primaryModal=true;
        }
        
        
      },
      buscateEmpleado(opt){
        if(opt){
          console.log("paciente:"+opt.a_title+" ID:"+opt.id+" TIPO:"+opt.tipo);
          this.tipo=opt.tipo;
        }        
        //alert(this.value);

      },
      getCustomDescription(opt) {
        return opt.a_title
      },
      eliminaTurno(){
        console.log("eliminando");
      }
  }
}
</script>

<style>
.mx-input-wrapper {
    position: relative;
    margin: 10px 5px !important;
}
.mx-datepicker{
  margin-top: 5px!important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
