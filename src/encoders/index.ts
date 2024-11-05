import advancedPipe from "./advancedPipe";
import junctionCheck from "./junction/junctionCheck";
import junctionGte from "./junction/junctionGte";

const encoders = {
  advancedPipe,

  // junction
  junction: {
    check: junctionCheck,
    gte: junctionGte,
  },
};

export default encoders;
