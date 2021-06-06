const DateTime = luxon.DateTime
const Info = luxon.Info



const app = Vue.createApp({
    data: function () {
      return {
        months: Info.months(),
        years: [2019,2020,2021, 2022, 2023, 2024, 2025,2026],
        selectedMonth: (new Date()).getMonth()+1,
        selectedYear: (new Date()).getFullYear(),
        events: [
            { "title": "First Title", "date": "2021-04-07T01:02", "details": "This is a description" },
            { "title": "Second Title", "date": "2021-04-16T01:02", "details": "Wow! Another description!!" }
        ]
      }
    },
    computed: {
      dayOfWeek: function () {
        return DateTime.local(this.selectedYear, this.selectedMonth).weekday
      },
      startWithSunday: function () {
        const date = DateTime.local(this.selectedYear, this.selectedMonth)
        return date.weekday === 7 ? 0 : date.weekday
      },
      dayOfWeekName: function () {
        return DateTime.local(this.selectedYear, this.selectedMonth).weekdayLong
      },
      daysInMonth: function () {
        return DateTime.local(this.selectedYear, this.selectedMonth).daysInMonth
      },
      monthEvents: function () {
          return this.events.filter(e => (new Date(e.date)).getMonth()+1 === this.selectedMonth && (new Date(e.date)).getFullYear() === this.selectedYear )
      },
      days: function () {
          let daysCount = this.daysInMonth
          let start = this.startWithSunday
          let total = []

          // Insert empty days   
          for (let index = 0; index < start; index++) {
              let d = null
              total.push(d)
          }
          // Insert calendar days
          for (let index = start; index < daysCount+start; index++) {
              total.push(index-start+1)
          }

          // Insert empty days   
          for (let index = total.length; index < 35; index++) {
            let d = null
            total.push(d)
        }
          console.log(total)
          return total
      },
    },
    methods: {
        deleteEvent(event) {
          let n = this.events.filter(e => e.title !== event.title)
          this.events = n
        },
    }
})

app.component('day-card', {
    props: ['day', 'event', 'update', 'delete'],
    data: function () {
      return {
        title: '',
        date: '',
        details: '',
      }
    },
    created: function(){
      if(this.event.length > 0){
        this.title = this.event[0].title
        this.date = this.event[0].date
        this.details = this.event[0].details
      }
    },
    methods: {
      handleDelete(e) {
        this.delete(this.event[0])
        let d = (new Date(this.event[0].date)).getDate()

      },
      handleUpdate(e) {
        e.preventDefault()
        this.update(this.event[0],{title: this.title, date: this.date, details: this.details})
      }
    },
    template: `
    <div data-bs-toggle="modal" :data-bs-target="'#modal'+day" class="eventtext">
    {{event[0].title}}
    {{(new Date(event[0].date)).toLocaleTimeString()}}
    </div>
  
  <!-- Modal -->
  <div class="modal" :id="'modal'+day" data-bs-keyboard="true" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
            <form>
                <div class="mb-3">
                    <input type="text" v-model="title" class="form-control" id="title" :value="title" placeholder="Title">
                </div>
                <div class="mb-3">
                    <input type="datetime-local" v-model="date" class="form-control" id="datetime" :value="date" name="datetime">
                </div>
                <div class="mb-3">
                    <input type="text" class="form-control" v-model="details" id="details" name="details" :value="details" placeholder="Additional info..">
                </div>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" @click="handleUpdate">Update</button>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="handleDelete">Delete Event</button>
        </div>
      </div>
    </div>
  </div>
    `
})

app.component('add-event', {
    props: {
        'addevent': {type: Function}
    },
    data: function () {
        return {
          title: '',
          date: null,
          details: ''
        }
    },
    methods: {
        submitEvent(event){
            console.log(event)
            event.preventDefault()
            console.log('Submitting')
            let e = {title: this.title, date: this.date, details: this.details}
            this.addevent(e)
        }
    },
    template: `
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addEventModal">
        Add Event
    </button>

    <!-- Modal -->
    <div class="modal fade" id="addEventModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <input type="text" v-model="title" class="form-control" id="title" placeholder="Title">
                        </div>
                        <div class="mb-3">
                            <input type="datetime-local" v-model="date" class="form-control" id="datetime" name="datetime">
                        </div>
                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="details" id="details" name="details" placeholder="Additional info..">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="submitEvent">Add Event</button>
                </div>
            </div>
        </div>
    </div>
    `
})

const vm = app.mount('#app')