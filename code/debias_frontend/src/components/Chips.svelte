<script>
  export let tones;
  export let group;
</script>

<style>
  .material-icons {
    font-size: 22px;
  }

  .chip-item {
    margin-top: 32px;
    margin-right: 16px;
  }

  .chip-container {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
    padding: 0;
    margin: 0;
    margin-bottom: 30px;
  }

  label {
    background-color: var(--chip-bg-color);
    padding: 7px 16px 7px 8px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 600;
    /* box-shadow: 0 2px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.08); */
    border: 2px solid var(--chip-border-color);
    color: rgb(122, 122, 122);
  }

  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
    margin: 0;
    padding: 0;
  }
  input[type="checkbox"]:checked + label {
    background-color: var(--primary-hover-color);
    color: var(--primary-color);
    border-color: var(--primary-hover-color);
  }
  input:hover + label {
    background: var(--chip-hover-color);
    border-color: var(--chip-hover-color);
    cursor: pointer;
  }
  @media only screen and (max-device-width: 540px) {
    .chip-container {
      margin: 12px 0px;
      /* justify-content: space-evenly; */
    }
    .chip-item {
      margin: 12px 0px;
    }
    label {
      font-size: 12px;
      padding: 7px 16px 7px 8px;
      border-width: 1px;
    }
    .material-icons {
      font-size: 16px;
    }
  }
</style>

<div class="chip-container">
  {#each tones as tone}
    <div class="chip-item">
      <input
        type="checkbox"
        bind:group
        name={tone.name.toLowerCase()}
        value={tone.name.toLowerCase()}
        id={tone.name.toLowerCase()} />
      <label for={tone.name.toLowerCase()}>
        <!-- style="color: {tone.color}" -->
        <i class="material-icons">{tone.icon}</i>&nbsp;&nbsp;{tone.name}</label>
    </div>
  {/each}
</div>
