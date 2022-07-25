<template>
  <div class="index-page" >
    <div class="landing">
      <div class="top"></div>
      <div class="left side-container">
          <div class="text-container" ref="t1">
              <h1>Simply Notes</h1>
              <h2>Make and export notes easily</h2>
              <NuxtLink to="/dashboard">
                  <p class="action-link">
                      Get <span class="spacer"> </span>Started
                  </p>
              </NuxtLink>
          </div>
          <!-- { !mobile && <div class="markdown-edit-preview" ref="t2">
              <MacWindow darkMode={store.darkMode}>
                  <Editor style={{display: 'grid'}} onChange={changeDoc} initialDoc={initialDoc}/>
              </MacWindow>
          </div> } -->
          <div class="s-logo"><p  ref="s1">S</p></div>
        </div>
        <div class="right side-container">
          <div class="s-logo"><p  ref="s2">S</p></div>
        <!-- { !mobile && <div class="markdown-preview">
            <MacWindow darkMode={store.darkMode}>
                <Preview style={{display: 'grid'}} doc={example.code}/>
            </MacWindow>
        </div> } -->
          <div class="text-container">
            <h1>Markdown &amp; Latex</h1>
            <h2>Use markdown and Latex&#39;s math syntax</h2>
            <NuxtLink to="dashboard">
                <p class="action-link">
                    Get <span class="spacer"> </span>Started
                </p>
            </NuxtLink>
          </div>
        </div>
    </div>
    <div class="landing-preview">
      <div class="right-text">
        <h3>Try it</h3>
      </div>
      <div class="container">
        <div class="markdown-edit-preview preview" >
          <!-- <MacWindow darkMode={store.darkMode}>
              <Editor style={{display: 'grid'}} onChange={changeDoc} initialDoc={initialDoc}/>
          </MacWindow> -->
        </div> 
        <div class="markdown-preview preview">
          <!-- <MacWindow darkMode={store.darkMode}>
              <Preview style={{display: 'grid'}} doc={example.code}/>
          </MacWindow> -->
        </div>
      </div>
        
    </div>
  </div>
</template>

<script lang="ts" setup>

const s1 = ref<HTMLElement>(null);
const s2 = ref<HTMLElement>(null);
const t1 = ref<HTMLElement>(null);
const t2 = ref<HTMLElement>(null);

useEventListener("scroll", (event) => {
  let percentage = (document.documentElement.scrollTop % window.innerHeight) / window.innerHeight;
  s1.value.style.transform = `translateY(-${percentage*100}%)`
  s2.value.style.transform = `translateY(${percentage*100}%)`
  t1.value.style.transform = `translateY(${0.8 * document.documentElement.scrollTop}px)`
  // t2.value.style.transform = `translateY(-${percentage*100}%)`
})


</script>


<style lang="scss" scoped>
@import "~/assets/styles/variables.scss";

.index-page {
    background-color: var(--selected-ui);
    display: grid;
    align-items: center;
    justify-items: flex-start;
    grid-auto-rows: 100vh;

    @media only screen and (max-width: $mobile) {
        grid-template-rows: 100vh auto;
    }
}

.landing {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 80px 1fr;
    position: relative;
    z-index: 3;

    .top {
        background-color: var(--selected-ui);
        grid-column: span 3;
    }

    @media only screen and (max-width: $mobile) {
        grid-template-columns: 1fr;
        grid-template-rows: 80px 1fr 1fr;

        .top {
            grid-column: span 1;
        }
    }
}

.s-logo {
    position: absolute;
    z-index: 10;
    font-weight: 1000;
    display: grid;
    align-items: center;
    user-select: none;
    height: 100%;

    p {
        font-size: 20vw;
        transition: font-size 0.3s ease;
        text-shadow: 3px 3px rgba(0,0,0,0.5);

        &:hover {
            font-size: 22.5vw;
        }
    }

    @media only screen and (max-width: $mobile) {
        p {
            font-size: 144px;
        }
    }
}

.left.side-container {
    width: 50vw;
    justify-self: flex-end;
    text-align: right;
    display: grid;
    transform: translateY(0);
    justify-items: flex-end;
    position: relative;

    .text-container {
        margin-top: 20vh;
        margin-right: 20vw;
        text-align: left;
        z-index: 11;
        height: min-content;

        h1 {
            font-size: 44px;
        }
        h2 {
            font-weight: 300;
        }
    }

    .s-logo {
        animation: slide-up 0.3s ease-out forwards;
        right: -1.25vw;
        color: var(--plain-ui);
    }

    .markdown-edit-preview {
        position: absolute;
        bottom: 60px;
        left: 5vw;
        height: 30vh;
        width: 30vw;
        z-index: 11;

        .mac-window .container {
            overflow: hidden;
            .markdown-editor {
                text-align: left;
                height: calc(30vh - 40px);
                padding: 0;
            }
        }
    }

    @media only screen and (max-width: $mobile) {
        .s-logo {
            bottom: -87.5px;
            clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
            animation: slide-right 0.3s ease-out forwards;
        }
    }
}

.action-NuxtLink {
    color: #0366d6;
    display: grid;
    grid-template-columns: auto auto 1fr;
    padding: 10px;
    cursor: pointer;
    transform-origin: 0% 50%;
    transition: font-size 0.3s ease;
    font-size: 16px;
    width: min-content;

    &:hover {
        font-size: 19px;
        .spacer {
            width: 10px;
        }
    }

    .spacer {
        width: 5px;
        transition: width 0.5s ease;
    }
}

.right.side-container {
    width: 60vw;
    height: 100%;
    background-color: var(--plain-ui);
    clip-path: polygon(10vw 0, 100% 0, 100% 100%, 0 100%);
    transform: translateX(-10vw);
    display: grid;
    justify-self: flex-start;
    position: relative;

    .s-logo {
        left: -1.25vw;
        color: var(--selected-ui);
        animation: slide-down 0.3s ease-out forwards;
    }

    .text-container {
        margin-top: 60vh;
        margin-left: 20vw;
        z-index: 11;
        height: min-content;

        h1 {
            font-size: 44px;
        }
        h2 {
            font-weight: 300;
        }
    }

    .markdown-preview {
        position: absolute;
        top: 5vh;
        right: 5vw;
        height: 30vh;
        overflow: hidden;
        width: 30vw;
        .preview {
            height: calc(30vh - 40px);
            padding: 0 45px;
        }
    }

    @media only screen and (max-width: $mobile) {
        transform: translateX(0);
        clip-path: none;

        .s-logo {
            top: -87.5px;
            clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
            animation: slide-left 0.3s ease-out forwards;
        }
    }
}

.side-container {
    @media only screen and (max-width: $mobile) {
        width: 100% !important;

        .text-container {
            margin: auto !important;
            padding: 20px;
            height: min-content;
            text-align: center;
        }

        .s-logo {
            width: 100%;
            height: 175px;
            text-align: center;
            right: 0 !important;
            left: 0 !important;
        }
    }
}

@keyframes slide-down {
    0% {
        transform: translateY(-50%) ;
    }
    100% {
        transform: translateY(0) ;
    }
}
@keyframes slide-up {
    0% {
        transform: translateY(50%);
    }
    100% {
        transform: translateY(0);
    }
}
@keyframes slide-right {
    0% {
        transform: translateX(-50%) ;
    }
    100% {
        transform: translateY(0) ;
    }
}
@keyframes slide-left {
    0% {
        transform: translateX(50%);
    }
    100% {
        transform: translateY(0);
    }
}

.landing-preview {
    width: 100vw;
    height: 100%;
    min-height: 100vh;
    background-color: var(--plain-ui);
    z-index: 2;
    display: grid;
    grid-template-rows: 215px 1fr;

    .right-text {
        display: grid;
        align-items: center; 

        h3 {
            height: min-content;
            width: auto;
            font-size: 44px;
            text-align: right;
            padding-right: 20vw;
        }
    }
    
    & > .container {
        display: grid;
        max-width: min(1366px, 100%);
        margin: auto;
        width: 100%;
        grid-template-columns: 1fr 1fr;
        max-height: 100%;
        padding: 45px;
        gap: 45px;
    }
    

    .preview {
        height: 400px;

        .mac-window .container {
            overflow: hidden;
            .markdown-editor, .markdown-previewer {
                height: 360px;
                padding: 0;
            }
        }
    }

    @media only screen and (max-width: $mobile) {
        grid-template-rows: 130px 1fr;
        height: auto;

        .right-text {
            align-items: flex-end;
            h3 {
                padding: 0;
                text-align: center;
            }
        }

        & > .container {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;
        }

        .preview {
            height: 256px;

            .mac-window .container {
                overflow: hidden;
                .markdown-editor {
                    height: 216px;
                    textarea {
                        max-height: unset;
                    }
                }
                .markdown-previewer {
                    height: 216px;
                } 
            }
        }
    }
}

</style>
