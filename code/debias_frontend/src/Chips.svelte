<script>
  export let tones;
  export let group;
</script>

<style>
  .material-icons {
    font-size: 22px;
  }

  .chip-container {
    height: auto;
    margin: 16px;
    margin-top: 0;
  }

  label {
    display: inline-block;
    background-color: var(--chip-bg-color);
    padding: 7px 12px;
    border-radius: 24px;
    margin-top: 16px;
  }

  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  input[type=checkbox]:checked + label {
    background-color: var(--chip-select-bg-color);
  }
  input:hover + label {
    background: var(--chip-hover-color);
    cursor: pointer;
  }
  span {
  color: var(--font-color);
  }
</style>

<div class="chip-container">
  {#each tones as tone}
    <input
      class="chip"
      type="checkbox"
      bind:group
      name={tone.name.toLowerCase()}
      value={tone.name.toLowerCase()}
      id={tone.name.toLowerCase()} />
    <label style="color: {tone.color}" for={tone.name.toLowerCase()}>
      <i class="material-icons">fiber_manual_record</i><span>{tone.name}</span></label>
  {/each}
</div>
