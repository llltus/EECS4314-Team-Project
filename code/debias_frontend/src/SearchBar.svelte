<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let searchQuery = "";

  const clickSearch = () => document.getElementById("searchButton").click();

  function emitSearchQuery() {
    document.activeElement.blur();
    dispatch("testEmit", searchQuery);
  }
</script>

<style>
  .inp {
    position: relative;
    margin: auto;
    width: 100%;
    max-width: 80%;
    border-radius: 3px;
    background-color: var(--card-bg-color);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.14);
  }

  .inp .label {
    position: absolute;
    top: 18px;
    left: 12px;
    color: var(--hint-color);
    font-weight: 400;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
    pointer-events: none;
  }

  .inp .icon {
    position: absolute;
    top: 16px;
    right: 16px;
    color: var(--hint-color);
  }

  .inp .focus-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.05);
    z-index: -1;
    -webkit-transform: scaleX(0);
    transform: scaleX(0);
    -webkit-transform-origin: left;
    transform-origin: left;
  }

  .inp input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    border: 0;
    font-family: inherit;
    padding: 16px 16px 0 20px;
    height: 56px;
    font-size: 16px;
    font-weight: 400;
    background: rgba(0, 0, 0, 0);
    color: var(--font-color);
    -webkit-transition: all 0.15s ease;
    transition: all 0.15s ease;
  }

  .inp input:hover {
    background-color: var(--card-hover-color);
  }

  .inp input:not(:placeholder-shown) + .label {
    color: var(--font-color);
    -webkit-transform: translate3d(0, -12px, 0) scale(0.75);
    transform: translate3d(0, -12px, 0) scale(0.75);
  }

  .inp input:focus {
    outline: none;
    box-shadow: inset 0 -2px 0 var(--primary-color);
  }

  .inp input:focus + .label {
    color: var(--primary-color);
    -webkit-transform: translate3d(0, -12px, 0) scale(0.75);
    transform: translate3d(0, -12px, 0) scale(0.75);
  }
  @media only screen and (max-device-width: 860px) and (-webkit-min-device-pixel-ratio: 1) {
    .inp {
      width: 100%;
      max-width: 96%;
    }
  }
</style>

<button
  id="searchButton"
  on:click={emitSearchQuery}
  style="display: none">Search</button>

<label for="inp" class="inp">
  <input
    type="text"
    id="inp"
    placeholder="&nbsp;"
    bind:value={searchQuery}
    on:keyup={(e) => e.key === 'Enter' && clickSearch()} />
  <span class="label">&nbsp;&nbsp;&nbsp;Search</span>
  <span class="icon"><i class="material-icons">search</i></span>
  <span class="focus-bg" />
</label>
