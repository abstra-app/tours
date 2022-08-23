# Abstra Tours

Simple js library to create an user onboarding 

## Usage

- Copy the template from `examples/exampleTour` 

- On the `runTour` function call, fill the params with:
  - `tour-key`: a identifier of you onboarding: replace `example-tour` with yours
  - `steps`: is a array representing the steps, add as many as you like
    - `hint`: tooltip text to be displaying on hover
    - `key`: a step identifier (must be unique)
    - `type`: currently only `beacon` is supported
    - `targetElementXpath`: a xpath selecting the desired element in which the beacon will be shown
    - `position`: use a object with `top`, `left`, `bottom` or `right` to position the beacon inside the target element
    - `hintPosition`: use `right` or `left` to change tooltip direction
  - `fetchViewedSteps`: a function used to fetch currently viewed steps by the user. The example uses a local storage implementation but you can replace it with an API call
  - `recordStepViewed`: a function used to save a step viewed by the user. As the previous, you can replace it with an API call

- To run the tour on your page, just import and call `initExampleTour`
