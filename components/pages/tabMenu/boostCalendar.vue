/* eslint-disable vue/no-v-html */
<template>
  <v-container
    id="scroll-target"
    fluid
    style="height: calc(100vh - 112px);
        background-image:url(https://thumb.photo-ac.com/ca/ca2e9a6bf34c22ba33811cd00398b7ab_w.jpeg);
        background-size:cover;"
    class="overflow-y-auto red"
  >
    <v-card>
      <v-card-title>
        <span><v-img src="/store/calendar.png" height="50" width="50" contain /></span>&nbsp;
        Boost Calendar
        <v-chip class="ma-2" small>
          プレビュー版
        </v-chip>
        <v-spacer />
        <v-btn>一般設定</v-btn>
      </v-card-title>
      <v-card-text class="scroll-y">
        <iframe src="https://wekan.github.io/wekan-markdown.png" frameborder="0" width="100%" height="600px" />
        <v-row class="fill-height">
          <v-col>
            <v-sheet height="64">
              <v-toolbar
                flat
              >
                <v-btn
                  outlined
                  class="mr-4"
                  color="grey darken-2"
                  @click="setToday"
                >
                  Today
                </v-btn>
                <v-btn
                  fab
                  text
                  small
                  color="grey darken-2"
                  @click="prev"
                >
                  <v-icon small>
                    mdi-chevron-left
                  </v-icon>
                </v-btn>
                <v-btn
                  fab
                  text
                  small
                  color="grey darken-2"
                  @click="next"
                >
                  <v-icon small>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
                <v-toolbar-title v-if="$refs.calendar">
                  {{ $refs.calendar.title }}
                </v-toolbar-title>
                <v-spacer />
                <v-menu
                  bottom
                  right
                >
                  <template #activator="{ on, attrs }">
                    <v-btn
                      outlined
                      color="grey darken-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <span>{{ typeToLabel[type] }}</span>
                      <v-icon right>
                        mdi-menu-down
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="type = 'day'">
                      <v-list-item-title>Day</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = 'week'">
                      <v-list-item-title>Week</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = 'month'">
                      <v-list-item-title>Month</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = '4day'">
                      <v-list-item-title>4 days</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-toolbar>
            </v-sheet>
            <v-sheet height="600">
              <v-calendar
                ref="calendar"
                v-model="focus"
                color="primary"
                :events="events"
                :event-color="getEventColor"
                :type="type"
                @click:event="showEvent"
                @click:more="viewDay"
                @click:date="viewDay"
                @change="updateRange"
              />
              <v-menu
                v-model="selectedOpen"
                :close-on-content-click="false"
                :activator="selectedElement"
                offset-x
              >
                <v-card
                  color="grey lighten-4"
                  min-width="350px"
                  flat
                >
                  <v-toolbar
                    :color="selectedEvent.color"
                    dark
                  >
                    <v-btn icon>
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <v-toolbar-title v-html="selectedEvent.name" />
                    <v-spacer />
                    <v-btn icon>
                      <v-icon>mdi-heart</v-icon>
                    </v-btn>
                    <v-btn icon>
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-card-text>
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <span v-html="selectedEvent.details" />
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      text
                      color="secondary"
                      @click="selectedOpen = false"
                    >
                      Cancel
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  // 親コンポーネントからの引継ぎ値
  props: {
    projectId: { // プロジェクトID
      type: String,
      required: true
    }
  },
  data: () => ({
    focus: '',
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days'
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party']
  }),
  mounted () {
    this.$refs.calendar.checkChange()
  },
  methods: {
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        // eslint-disable-next-line no-return-assign
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    updateRange ({ start, end }) {
      const events = []

      const min = new Date(`${start.date}T00:00:00`)
      const max = new Date(`${end.date}T23:59:59`)
      const days = (max.getTime() - min.getTime()) / 86400000
      const eventCount = this.rnd(days, days + 20)

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        const second = new Date(first.getTime() + secondTimestamp)

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay
        })
      }

      this.events = events
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    }
  }
}
</script>
