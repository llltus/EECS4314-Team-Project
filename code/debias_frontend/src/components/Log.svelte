<script>
  export let log;
</script>

<style>
  .card {
    background-color: var(--card-bg-color);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.14);
    border-radius: 4px;
    padding: 24px;
    width: 96%;
    max-width: 720px;
    margin: auto;
    margin-bottom: 24px;
    text-align: initial !important;
  }
  .level_time_flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .path_flex {
    display: inline-flex;
    justify-content: flex-start;
    margin-bottom: 16px;
    background-color: var(--log-path-bg-1);
    border-radius: 4px;
  }
  .ip {
    padding: 8px 8px 8px 12px;
  }
  .method {
    color: white;
    background-color: var(--log-path-bg-2);
    padding: 8px 4px 8px 12px;
    border-radius: 4px 0px 0px 4px;
  }
  .path {
    color: white;
    background-color: var(--log-path-bg-2);
    padding: 8px 12px 8px 0px;
    border-radius: 0px 4px 4px 0px;
  }
  .message {
    color: var(--card-title-color);
    text-align: left;
    line-height: 140%;
  }
  .level {
    color: var(--selected-font-color);
    background-color: #f44336;
    font-weight: bold;
    padding: 8px;
    border-radius: 4px;
  }
  .method {
    padding-left: 8px;
  }
  @media only screen and (max-device-width: 860px) and (-webkit-min-device-pixel-ratio: 1) {
    .card {
      width: 100%;
      max-width: 100%;
    }
  }
</style>

<div class="card">
  <div class="level_time_flex">
  <div class="level">{log.level}: {log.failure}</div>
    <div class="timestamp">{log.timestamp}</div>
  </div>
  <div class="path_flex">
    <div class="ip">{log.ip}</div>
    <div class="method">{log.method}:</div>
    <div class="path">{log.path}</div>
  </div>
  <div class="message">{log.message}</div>
</div>
