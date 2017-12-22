# poi-plugin-mo2

Morale monitor (a.k.a mo2) is a [poi](https://github.com/poooi/poi) plugin
designed for getting morale status for your fleets and ships quickly.

## Changelog

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
