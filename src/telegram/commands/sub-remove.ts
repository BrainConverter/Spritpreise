import { Markup } from 'telegraf'
import { GasStation, Subscription } from '../../data/model'
import { getReadableGasType } from '../../utils'

export function init (bot) {

  bot.action('sub_remove_menu', async (ctx) => {
    const subs = await Subscription.find({chatId: ctx.chat.id})
    if (subs.length === 0) {
      await ctx.editMessageText('Keine Abonnements vorhanden!')
    } else {
      const buttons = []
      for (const sub of subs) {
        const station = await GasStation.findOne({stationId: sub.stationId}, {brand: 1, street: 1, city: 1})
        buttons.push([Markup.callbackButton(`${station.brand} ${station.street} ${station.city}, ${getReadableGasType(sub.type)}`, `subcb_${sub.stationId}_${sub.type}`)])
      }
      const subsFoundMenu = Markup.inlineKeyboard(buttons).extra()
      await ctx.editMessageText('Folgende Abonnements sind für dich registriert', subsFoundMenu)
    }
  })

  bot.action(new RegExp('subcb_\S*'), (ctx) => {
    const stationId = ctx.update.callback_query.data.split('_')[1]
    const type = ctx.update.callback_query.data.split('_')[2]

    const subDeleteMenu = Markup.inlineKeyboard([
      [ Markup.callbackButton('Löschen! ❌', `subdelcb_${stationId}_${type}`),
      ],
    ]).extra()

      ctx.editMessageText('Willst du das Abonnement wirklich löschen?', subDeleteMenu)
  })

  bot.action(new RegExp('subdelcb_\S*'), async (ctx) => {
    const stationId = ctx.update.callback_query.data.split('_')[1]
    const type = ctx.update.callback_query.data.split('_')[2]

    const subsExists = await Subscription.exists({stationId, type, chatId: ctx.chat.id})

    if (!subsExists) {
      await ctx.editMessageText(`Abon­ne­ment existiert nicht mehr! 🤷`)
      return
    }

    await Subscription.deleteOne({stationId, type, chatId: ctx.chat.id}).exec()

    await ctx.editMessageText(`Erfolgreich gelöscht! ✅`)
  })
}
