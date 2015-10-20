
var _ = require('underscore');


var RefugeeHighlightMixin = {

  storedDestinationCountries: [],
  storedOriginCountries: [],
  highlightStamp: 0,


  getInitialState: function() {
  	return {
  		hoveredCountry: null,
  		clickedCountry: null
  	}
  },


  handleMapClick: function() {
  	if (this.state.clickedCountry == this.state.hoveredCountry) {
      // clicking a country again should clear the 
      // "lock" on the country
      this.setState({clickedCountry: null});
    } else {
      this.setState({clickedCountry: this.state.hoveredCountry});  
    }
  },


  handleMouseOver: function(country) {
    this.pendingHoverOut = false;
    this.setHoveredCountry(country);
  },


  handleMouseLeave: function(country) {
    this.pendingHoverOut = true;
    window.setTimeout(function() {
      if (this.pendingHoverOut) {
        //console.log("setting hoveredCountry to null");
        this.setHoveredCountry(null);
      }
    }.bind(this), 50);
  },


  setHoveredCountry: function(country) {
    this.setState({hoveredCountry: country});
    
    if (!this.state.clickedCountry) {
      this.updateHighlight(country);  
    }
  },


  getHighlightedCountry: function() {
  	if (this.state.clickedCountry != null) {
  		return this.state.clickedCountry;
  	}
  	return this.state.hoveredCountry;
  },


  getDestinationCountries: function(country) {
    return this.props.refugeeCountsModel
      .getDestinationCountriesByStamp(country, this.getStamp());
  },


  getOriginCountries: function(country) {
    return this.props.refugeeCountsModel
      .getOriginCountriesByStamp(country, this.getStamp());
  },


  updateHighlight: function(country) {
    var dc = this.getDestinationCountries(country);
    var oc = this.getOriginCountries(country);

    // In some cases there are people
    // seeking asylum in both directions
    // for a country pair.
    //
    // In such a situtation we decide on which
    // which side to display based on whether 
    // [country] is mainly a sender or receiver. 
    //
    if (oc.length > dc.length) {
      dc =_.difference(dc, oc);
    } else {
      oc = _.difference(oc, dc);
    }

    this.country = country;
    if (dc.length != this.storedDestinationCountries.length
      || oc.length != this.storedOriginCountries.length) {
      this.storedDestinationCountries = dc;
      this.storedOriginCountries = oc;
      this.setState({});
    }
  },


  getHighlightLayerParams: function() {
    return {
      country: this.getHighlightedCountry(),
      originCountries: this.storedOriginCountries,
      destinationCountries: this.storedDestinationCountries
    }
  },

}


module.exports = RefugeeHighlightMixin;