import TelegrafInlineMenu from 'telegraf-inline-menu'
import { GasStation } from '../../data/model'
import { findStations } from '../../data/station-find'

const stationMenu = new TelegrafInlineMenu('Tankstellen')
stationMenu.setCommand('station')

stationMenu.simpleButton('Auflistung', 'list_stations', {
    doFunc: async ctx => {
        const stations = await GasStation.find({}, {stationId: 1, name: 1, street: 1})
        if (stations.length === 0) {
          await ctx.reply('Keine vorhanden!')
        } else {
          let message = 'Folgende Tankstellen werden bereits getrackt:\n\n'
          stations.forEach(station => {
            message += `Name: ${station.name}\nStraße: ${station.street}\n\n`
          })
          await ctx.reply(message)
        }
    }
})
/*
stationMenu.question('Umkreissuche', 'find_station', { questionText: 'Bitte schicken Sie mir ihren Standort.', uniqueIdentifier: 'find_station_question',
    setFunc: async (ctx) => {
        const location = ctx.message?.location;
        if (!location) {
            ctx.reply('Sie haben mir leider keinen Standort geschickt.')
            return
        }
        const stations = await findStations(location).then(s => s.slice(0,5))
        
        if (stations.length === 0) {
            await ctx.reply(`Keine Tankstellen in der Umgebung gefunden!`)
        } else {
            for(let i = 0; i < Math.min(stations.length, 5); i++) {
                const station = stations[i]
                const name = Math.random().toString()
                console.log(name)
                stationMenu.button(`${station.brand} ${station.street}`, name, {
                    doFunc: (ctx) => { console.log(ctx.message.text)}
                  })
            } 
      

          let message = `Tankstellen in der Umgebung:\n\n`
          for (const s of stations) {
            message += `ID: ${s.id}\nName: ${s.name}\nStraße: ${s.street}\n\n`
          }
          await ctx.reply(message)
        }
        
    }
})*/


stationMenu.question('Umkreissuche', 'find_station', { questionText: 'Bitte schicken Sie mir ihren Standort.', uniqueIdentifier: 'find_station_question',
    setFunc: async (ctx) => {
        const location = ctx.message?.location;
        if (!location) {
            ctx.reply('Sie haben mir leider keinen Standort geschickt.')
            return
        }
        const stations = await findStations(location).then(s => s.slice(0,5))
        stationMenu.select('station_select', () => stations.map(s => `${s.brand} ${s.street}`), {
          setFunc: (ctx, key) => {
            console.log(key)
          }
        })
      }
    }
)

export function init (bot) {
    bot.use(stationMenu.init())
}