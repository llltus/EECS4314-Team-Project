<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let searchQuery = "";

  const clickSearch = () => document.getElementById("searchButton").click();

  function emitSearchQuery() {
    dispatch("testEmit", searchQuery);
  }
</script>

<style>
  .inp {
    position: relative;
    margin: auto;
    width: 100%;
    max-width: 86%;
    border-radius: 3px;
    background-color: white;

    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.14);
    /* -webkit-box-shadow: 1px 6px 8px 0px rgba(0,0,0,0.06);
  -moz-box-shadow: 1px 6px 8px 0px rgba(0,0,0,0.06); */
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
    background: rgba(0, 0, 0, 0.00);
    /* box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.3); */
    color: #000;
    -webkit-transition: all 0.15s ease;
    transition: all 0.15s ease;
  }
  .inp input:hover {
    background: rgba(0, 0, 0, 0.02);
    /* box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.5); */
  }
  .inp input:not(:placeholder-shown) + .label {
    color: rgba(0, 0, 0, 0.5);
    -webkit-transform: translate3d(0, -12px, 0) scale(0.75);
    transform: translate3d(0, -12px, 0) scale(0.75);
  }
  .inp input:focus {
    /* background: rgba(0, 0, 0, 0.05); */
    outline: none;
    box-shadow: inset 0 -2px 0 #0077ff;
  }
  .inp input:focus + .label {
    color: #0077ff;
    -webkit-transform: translate3d(0, -12px, 0) scale(0.75);
    transform: translate3d(0, -12px, 0) scale(0.75);
  }
  /* .inp input:focus + .label + .focus-bg {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
  } */
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
