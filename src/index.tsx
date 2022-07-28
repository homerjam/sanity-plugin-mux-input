import React from 'react'
import {type Rule, createPlugin} from 'sanity'

import Input from './components/Input'
import ThemeProviderFixer from './components/ThemeProviderFixer'
import muxVideo from './schema/mux.video'
import videoAsset from './schema/mux.videoAsset'
import {isMuxInputProps} from './util/asserters'
import {type Config} from './util/types'

/*
// @TODO use declaration merging to allow correct typings for userland schemas when they use type: mux.video
declare module 'sanity' {
  namespace Schema {

  }
}
// */

/* @TODO export validation rules for: required (checks if the video asset is defined), and that it has a ready uploaded file
export const validation = {
  required(Rule: Rule) {
    return
  }
}
// */

export const defaultConfig: Config = {
  mp4_support: 'none',
}

export const muxInput = createPlugin<Config>((userConfig) => {
  const config: Config = {...defaultConfig, ...userConfig}
  return {
    name: 'mux-input',
    form: {
      renderInput(props, next) {
        if (isMuxInputProps(props)) {
          if (process.env.NODE_ENV !== 'production') {
            // @TODO this seems to only be a risk when using yalc symlinking in dev mode, investigate a way to reliably reproduce and adress this error
            /**
             * How to reproduce the issue that makes this workaround necessary:
              import {Text} from '@sanity/ui'
              import {render} from 'react-dom'

              const node = document.createElement('div')
              document.body.append(node)

              render(
                <ThemeProviderFixer>
                  <Text>Hi!</Text>
                </ThemeProviderFixer>,
                node
              )
             */
            return (
              <ThemeProviderFixer>
                <Input config={config} {...props} />
              </ThemeProviderFixer>
            )
          }

          return <Input config={config} {...props} />
        }
        return next(props)
      },
    },
    schema: {types: [muxVideo, videoAsset]},
  }
})

export {Input}
export {default as Preview} from './components/Preview'