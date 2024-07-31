import React from "react";
import {Previews} from "@react-buddy/ide-toolbox-next";

import {PaletteTree} from "./palette";

const ComponentPreviews = () => (
    <Previews palette={<PaletteTree/>} />
  );

export default ComponentPreviews;
