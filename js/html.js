// `html` writes React elements as templates, which removes the need for a JSX build step:
//   html`<button className="btn" onClick=${save}>Save</button>`
// Components are written <${Board} state=${state} /> and closed with <//>.
import React from 'react';
import htm from 'htm';

export const html = htm.bind(React.createElement);
