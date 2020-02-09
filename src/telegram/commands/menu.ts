import TelegrafInlineMenu from 'telegraf-inline-menu'

const mainMenu = new TelegrafInlineMenu('Main Menu')
const fooMenu = new TelegrafInlineMenu('Foo Menu')
const barMenu = new TelegrafInlineMenu('Bar Menu')

mainMenu.setCommand('test')
mainMenu.submenu('Open Foo Menu', 'foo', fooMenu)
fooMenu.submenu('Open Bar Menu', 'bar', barMenu)
barMenu.simpleButton('Hit me', 'something', {
    doFunc: ctx => ctx.reply('As am I!')
  })
  barMenu.button('Hit me bla', 'somethingnet', {
    doFunc: () => barMenu.simpleButton('newbtn', 'newbtn', {
        doFunc: ctx => ctx.reply('As am I!')
      })
  })

export function init (bot) {
    bot.use(mainMenu.init({backButtonText: 'back!'}))
}