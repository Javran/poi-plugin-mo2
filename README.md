# poi-plugin-mo2

Morale monitor (a.k.a mo2) is a [poi](https://github.com/poooi/poi) plugin
designed for getting morale status for your fleets and ships quickly.

## Changelog

### 0.8.2

- Bug fixes.

### 0.8.1

- New whale!

### 0.8.0

- Partially migrated to Blueprint3, this should fix the dropdown menu issue.

### 0.7.1

- New whale!

### 0.7.0

- Fix color issue for poi 10 dark theme

### 0.6.1

- Bug fix to a problem that would occur when const data is not available

### 0.6.0

- Now items in fleet morale list can move up and down freely
- New filter for escort carriers
- Some UI tweaks
- Fleet Morale tab can now track LBAS morale for a specified world
- A easter egg for "whaly"-admirals :)

### 0.5.7

- Adapted to use phase 2 new sorting method
- Few minor updates

### 0.5.6

- Fix a problem with tooltip

### 0.5.5

- Another attempt fixing potential errors while updating (hopefully working this time)

### 0.5.4

- Fix some potential errors while updating old config

### 0.5.3

- Fix sorting by name

### 0.5.2

- DLC-capability is now computed from WhoCallsTheFleet fcd data

### 0.5.1

- Bug fix (not actually affecting anything noticable)

### 0.5.0

- Improved internal mechanism

- Making filter method more flexible

    - Supported operators: `>`, `>=`, `<`, `<=`, `=`

### 0.4.7

- Better scrolling

### 0.4.6

- Tama K2 update
- Fix a problem when `getStore().const` is empty

### 0.4.5

- Fix a problem when `getStore().const` is empty

### 0.4.4

- Require confirmation before removing a fleet morale list item

### 0.4.3

- Fix a problem where the tab isn't taking full height

### 0.4.2

- Reverting Fleets tab's add button to pop downwards

### 0.4.1

- Fix filter `CV / CVL / CVB`
- Mark Fumizuki K2 as DLC-capable

### 0.4.0

- Least poi version requirement: `7.9.0`
- Some optimization
- Every ship type filter now has its own morale filter state
- Tab focus (fleets tab or ships tab) is now remembered
- Fleets tab's Add button now pops upwards instead of downwards.
- Allow editing morale filters through settings

### 0.3.1

- Mark Yura K2 as DLC-capable ship

### 0.3.0

- Allow moving custom fleets up and down

### 0.2.0

- Fix missing translation for JP an KR.
- Introduce new ship filter: DLC-capable (DD only)
- Hide some useless ship type filters
- Fix wrong text in fleet list `Add...` dropdown

### 0.1.1

- Translate ship list headers properly

### 0.1.0

- i18n supports

    Plugin is now available in following languages

    - English
    - Simplified Chinese
    - Traditional Chinese (through OpenCC)

- Fleet list improvements

    - fix a problem where unlocked ships are missing
    - more information on dropdown button
    - tooltip for detailed morale information

- Ship list improvements

    - colorized morale text
    - better table layout
    - some special ship type filters

- Handle in-game preset actions properly
