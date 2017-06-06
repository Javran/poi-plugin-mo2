This document defines the config file structure of `poi-plugin-mo2`.

# Overview

- The file is stored under `${APPDATA_PATH}/morale-monitor`
- Every admiral (game account) should have a separated config, under file name `${admiralId}.json`
- As the file extension suggests, it's a plain JSON file.

# Data Structures

## `Config` structure

- an Object of the following shape:

    ```
    {
      presetDeck: <from game API or null>,
      watchlist: <an Array of WSubject>,
    }
    ```

## `WSubject` structure

- an Object that guaranteed to have a `type` field.

- when `type` is `fleet`

    ```
    {
      type: "fleet",
      fleetId: <fleet id>
    }
    ```

    Having this type means we are watching one of the current fleet.
    `fleetId` respects in-game API (of `api_id`), which means
    it's a one-based index of fleet (ranged from `1` to `4`).

- when `type` is `preset`

    ```
    {
      type: "preset",
      presetNo: <fleet id>
    }
    ```

    Having this type means we are watching one of the preset fleet.
    where `presetNo` respects in-game API (of `api_preset_no`), which means
    it's a one-based index of preset.

- when `type` is `custom`

    ```
    {
      type: "custom",
      id: <an int>,
      name: <a string>
      ships: <an Array of rosterIds>
    }
    ```

    Having this type means we are watching a custom list of ships.
    Note that we might safely assume the array will not contain
    more than 6 elements as type `custom` only comes from either
    a fleet composition or a preset one, and both of them won't
    have more than 6 ships.

    `id` is just an integer that requires to be unique among
    all `WSubject`s of `custom` type.
