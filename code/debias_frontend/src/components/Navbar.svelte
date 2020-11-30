<script>
  import ThemeToggle from "./ThemeToggle.svelte";
</script>

<style>
  header {
    background-color: var(--card-bg-color);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.14);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1;
    padding: 0 24px;
  }
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 720px;
    margin: auto;
    padding: 0;
    height: 64px;
  }
  .navlink {
    display: block;
    height: 100%;
    line-height: 100%;
    color: var(--font-color);
    text-decoration: none;
    font-size: 1.2em;
    padding: 8px 24px;
  }
  .navlink:hover {
    background-color: var(--chip-hover-color);
  }

  .navlinktext {
    padding-top: 12px;
    font-size: 16px;
  }

  i {
    padding-right: 8px;
    padding-bottom: 4px;
  }

  .push {
    margin-left: auto;
  }

  @media only screen and (max-device-width: 860px) and (-webkit-min-device-pixel-ratio: 1) {
    header {
      padding: 0 12px;
      bottom: 0;
      top: auto;
      box-shadow: 0 -2px 3px rgba(0, 0, 0, 0.08), 0 -2px 2px rgba(0, 0, 0, 0.14);
    }
    .navlink {
      flex-grow: 1;
    }
    .navlinktext {
      padding: 0;
      height: 100%;
      font-size: 14px;
    }
    i {
      display: block;
      padding: 0;
      font-size: 22px;
    }
    .push {
      margin: 0;
      flex-grow: 1;
    }
  }
</style>

<header>
  <ul class="nav">
    <a class="navlink" href="/"><div class="navlinktext">
        <i class="material-icons">home</i>Home
      </div></a>
    <a class="navlink" href="/logs"><div class="navlinktext">
        <i class="material-icons">assignment</i>Logs
      </div></a>
    <div class="push">
      <ThemeToggle />
    </div>
  </ul>
</header>
