import React from 'react'
import Authentication from '../../util/Authentication/Authentication'

import './App.css'

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.Authentication = new Authentication()

        //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null. 
        this.twitch = window.Twitch ? window.Twitch.ext : null
        this.state = {
            finishedLoading: false,
            theme: 'light',
            isVisible: true
        }
    }

    contextUpdate(context, delta) {
        if (delta.includes('theme')) {
            this.setState(() => {
                return { theme: context.theme }
            })
        }
    }

    visibilityChanged(isVisible) {
        this.setState(() => {
            return {
                isVisible
            }
        })
    }

    componentDidMount() {
        if (this.twitch) {
            this.twitch.onAuthorized((auth) => {
                this.Authentication.setToken(auth.token, auth.userId)
                if (!this.state.finishedLoading) {
                    // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

                    // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
                    this.setState(() => {
                        return { finishedLoading: true }
                    })
                }
            })

            this.twitch.listen('broadcast', (target, contentType, body) => {
                this.twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
                // now that you've got a listener, do something with the result... 

                // do something...

            })

            this.twitch.onVisibilityChanged((isVisible, _c) => {
                this.visibilityChanged(isVisible)
            })

            this.twitch.onContext((context, delta) => {
                this.contextUpdate(context, delta)
            })
        }
    }

    componentWillUnmount() {
        if (this.twitch) {
            this.twitch.unlisten('broadcast', () => console.log('successfully unlistened'))
        }
    }

    //TODO: Replace mocked data with a builder for array of items retrieved from the streamer's /broadcast body
    render() {
        if (this.state.finishedLoading && this.state.isVisible) {
            return (
                <div class="colmask fullpage">
                    <div class="grid-container">
                        <div class="tooltip itemContainer">
                            <img src={require("./itemIcons/Paul's_Goat_Hoof.png")}/>
                            <div class="itemCount">5x</div>
                            <span class="tooltiptext">Increases <span class="utilityInfo">movement speed</span> by <span class="utilityInfo">14%</span> <span class="stackInfo">(+14% per stack)</span></span>
                        </div>
                        <div class="tooltip itemContainer">
                            <img src={require("./itemIcons/Armor-piercing_rounds.png")}/>
                            <div class="itemCount">66x</div>
                            <span class="tooltiptext">Deal an additional <span class="damageInfo">20%</span> damage <span class="stackInfo">(+20% per stack)</span> to bosses.</span>
                        </div>
                        <div class="tooltip itemContainer">
                            <img src={require("./itemIcons/Alien_Head.png")}/>
                            <div class="itemCount">5x</div>
                            <span class="tooltiptext"><span class="utilityInfo">Reduce skill cooldowns</span> by <span class="utilityInfo">25%</span> <span class="stackInfo">(+25% per stack).</span></span>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="App">
                </div>
            )
        }

    }
}