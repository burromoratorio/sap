<template>
  <div class="animated fadeIn">
    <CRow>
    <CCol md="6">
        <CCard>
          <div slot="header">
            <strong>Turnos del dia</strong>
          </div>

          <CDataTable small  :items="turnos" :fields="fields" :items-per-page="perPage" pagination>
            <!--<template #status="{item}">
              <td>
                <CBadge :color="getBadge(item.status)">{{item.status}}</CBadge>
              </td>
            </template>-->

            <template slot="status" slot-scope="turnos">
            <CButton type="button" size="sm" color="primary" @click="activModal(turnos.item.status)">
              <i :class="getBadge(turnos.item.status)" ></i>
            </CButton>
          </template>
          </CDataTable>
          <!--<nav>
           <b-pagination :total-rows="getRowCount(turnos)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
          </nav>-->
          <div slot="footer">
            <CButton type="submit" size="sm" color="primary"><i class="fa fa-dot-circle-o"></i> Submit</CButton>
            <CButton type="reset" size="sm" color="danger"><i class="fa fa-ban"></i> Reset</CButton>
          </div>
        </CCard>
    </CCol>
    <CCol md="6">
        <CCard>
          <div slot="header">
            <strong>Horizontal</strong> Form
          </div>
          <CForm label="Fecha" label-for="fecha" :label-cols="3" :horizontal="true">
                <CInput type="date" id="fecha" v-model="startDate" v-on:change="fetchProfesionales"></CInput>
                <!-- Attach Right button
                <b-input-group-append> <CButton color="primary" @click="fetchProfesionales">Buscar</CButton> </b-input-group-append> -->
          </CForm>
          <CForm label="Profesional" label-for="basicMultiSelect" :label-cols="3" :horizontal="true">
            <CSelect id="basicMultiSelect" :options="profesionales" :value.sync="profesional"
            v-on:change="cambiando"/>
            
          </CForm>
            <div slot="footer">
              <CButton type="submit" size="sm" color="primary"><i class="fa fa-dot-circle-o"></i> Submit</CButton>
              <CButton type="reset" size="sm" color="danger"><i class="fa fa-ban"></i> Reset</CButton>
            </div>
          </b-form>
        </CCard>
       </CCol>
       </CRow>
      <CRow>
        <CCol md="6">
        <b-modal title="Agendar Turno" class="modal-primary" v-model="primaryModal" @ok="primaryModal = false">
          <b-form>
            <CForm description="buscar por nombre y apellido" label="Seleccione el Paciente"
             label-for="basicName" :label-cols="3" :horizontal="true">
             <vue-single-select v-model="paciente" :options="pacientes" :required="true" option-label="a_title"
              :getOptionDescription="getCustomDescription" option-key="id" @input="buscatePaciente">
              </vue-single-select>
            </CForm>
          </b-form>
        </b-modal>
        </CCol>
      </CRow>
      <CRow>
        <CCol md="6">
          <b-modal title="Modal title" class="modal-danger" v-model="dangerModal" @ok="eliminaTurno = false" ok-color="danger">
          Está Ud. seguro de eliminar el turno?
        </b-modal>
        </CCol>
      </CRow>
  </div>

</template>

<script>
import Vue from 'vue';
import VueSingleSelect from "vue-single-select";
import CTableWrapper from '../base/Table.vue'
import DataService from '../../services/DataService';
const dataservice = new DataService();
var turnos = [];

export default {
  components: {
     VueSingleSelect
    },
    //...
  
  name: 'Alta',
  data () {
    return {
      turnos: [],
      fields: [
        {key: 'hora'},
        {key: 'paciente'},
        {key: 'status'}
      ],
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      selected: [], // Must be an array reference!
      show: true,
      startDate: '',
      primaryModal: false,
      dangerModal: false,
      fruit:[],
      profesionales:[],
      profesional:'',
      fecha:'',
      pacientes:[],
      paciente:''
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
    fetchProfesionales (fechita) {
      this.show = true;
      this.fecha=fechita;
      dataservice.getProfesionales().then( result => {
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
        //this.showAlert();
        //this.disabled=1;
      })
      
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
      
      dataservice.getTurnosDiaProfesional(this.fecha,prof).then( result => {
        if(result.status==200){
          console.log(result.data);
        }
      },
      (error) => {
        //this.showAlert();
        //this.disabled=1;
      })



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
            this.pacientes= [{ id: 1, a_title: "baz bar" },{ id: 2, a_title: "foo bar" },
                 { id: 3, a_title: "Eos rerum veniam quia mollitia"},{ id: 4, a_title: "Robs Thread" }];
            this.primaryModal=true;
            break;
          case "Pending":
            //traigo pacientes y permito editar el turno
            this.pacientes= [{ id: 1, a_title: "baz bar" },{ id: 2, a_title: "foo bar" },
                 { id: 3, a_title: "Eos rerum veniam quia mollitia"},{ id: 4, a_title: "Robs Thread" }];
            this.primaryModal=true;
        }
        
        
      },
      buscatePaciente(opt){
        if(opt){
          console.log("paciente:"+opt.a_title+" ID:"+opt.id);
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
