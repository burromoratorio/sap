<template>
  <div class="animated fadeIn">
    <b-row>
    <b-col md="6">
        <b-card>
          <div slot="header">
            <strong>Turnos del dia</strong>
          </div>

          <b-table small  :items="turnos" :fields="fields" :current-page="currentPage" :per-page="perPage">
            <template slot="status" slot-scope="turnos">
            <b-button type="button" size="sm" variant="primary" @click="activModal(turnos.item.status)">
              <i :class="getBadge(turnos.item.status)" ></i>
            </b-button>
          </template>
          </b-table>
          <nav>
           <b-pagination :total-rows="getRowCount(turnos)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
          </nav>
          <div slot="footer">
            <b-button type="submit" size="sm" variant="primary"><i class="fa fa-dot-circle-o"></i> Submit</b-button>
            <b-button type="reset" size="sm" variant="danger"><i class="fa fa-ban"></i> Reset</b-button>
          </div>
        </b-card>
    </b-col>
    <b-col md="6">
        <b-card>
          <div slot="header">
            <strong>Horizontal</strong> Form
          </div>
          <b-form-group label="Fecha" label-for="fecha" :label-cols="3" :horizontal="true">
            <b-input-group>
                <b-form-input type="date" id="fecha" v-model="startDate" v-on:change="fetchProfesionales"></b-form-input>
                <!-- Attach Right button
                <b-input-group-append> <b-button variant="primary" @click="fetchProfesionales">Buscar</b-button> </b-input-group-append> -->
            </b-input-group>
          </b-form-group>
          <b-form-group label="Profesional" label-for="basicMultiSelect" :label-cols="3" :horizontal="true">
            <b-form-select id="basicMultiSelect" :plain="true" :multiple="false" :options="profesionales" :value="profesional"
            v-on:change="cambiando">
            </b-form-select>
          </b-form-group>
            <div slot="footer">
              <b-button type="submit" size="sm" variant="primary"><i class="fa fa-dot-circle-o"></i> Submit</b-button>
              <b-button type="reset" size="sm" variant="danger"><i class="fa fa-ban"></i> Reset</b-button>
            </div>
          </b-form>
        </b-card>
       </b-col>
       </b-row>
      <b-row>
        <b-col md="6">
        <b-modal title="Agendar Turno" class="modal-primary" v-model="primaryModal" @ok="primaryModal = false">
          <b-form>
            <b-form-group description="buscar por nombre y apellido" label="Seleccione el Paciente"
             label-for="basicName" :label-cols="3" :horizontal="true">
             <vue-single-select v-model="paciente" :options="pacientes" :required="true" option-label="a_title"
              :getOptionDescription="getCustomDescription" option-key="id" @input="buscatePaciente">
              </vue-single-select>
            </b-form-group>
          </b-form>
        </b-modal>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-modal title="Modal title" class="modal-danger" v-model="dangerModal" @ok="eliminaTurno = false" ok-variant="danger">
          Está Ud. seguro de eliminar el turno?
        </b-modal>
        </b-col>
      </b-row>
  </div>

</template>

<script>
import Vue from 'vue';
import VueSingleSelect from "vue-single-select";
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
