/** @jsx React.DOM */
(function() {
'use strict';
var Card = React.createClass({displayName: 'Card',
	render: function() {
		var legislator = this.props.legislator;
		var email = legislator.email.trim().length > 0?
			React.DOM.a( {href:'mailto:'+legislator.email.trim()}, "Email") :
			''

		var twitter = legislator.twitter.trim().length > 0?
			React.DOM.a( {href:legislator.twitter}, "Twitter") : 
			''

		var facebook = legislator.facebook.trim().length > 0?
			React.DOM.a( {href:legislator.facebook}, "Facebook") : 
			''

		var anySocial = (facebook + twitter + email).length == 0?
			"Not Available" : ""

		return (
			React.DOM.div( {className:"card"}, 
				React.DOM.h3(null, legislator.first_name + " " + legislator.last_name),
				React.DOM.ul(null, 
					React.DOM.li(null, React.DOM.strong(null, "District:"), " ", legislator.district || "Not Available"),
					React.DOM.li(null, React.DOM.strong(null, "Sect: " ),legislator.sect || "Not Available"),
					React.DOM.li(null, React.DOM.strong(null, "Party: " ), " ", legislator.party || "Not Available"),
					React.DOM.li(null, React.DOM.strong(null, "Phone: " ), " ", legislator.phone || "Not Available"),
					React.DOM.li(null, React.DOM.strong(null, "Mobile: " ), " ", legislator.mobile || "Not Available"),
					React.DOM.li(null, React.DOM.strong(null, "Social: " ), " ", anySocial,
				React.DOM.span(null, email, " ", twitter, " ", facebook))
				)
			)
		);
	}
});

var Table = React.createClass({displayName: 'Table',
	render: function() {
		var rows = [];
		var lastCategory = null;
		this.props.legislators.forEach(function (legislator) {
			var name = legislator.first_name + " " + legislator.last_name;
			if (name.toLowerCase().indexOf(this.props.filterText.toLowerCase()) === -1 ||
				(this.props.district !== 'All' && legislator.district !== this.props.district) ||
				(this.props.sect !== 'All' && legislator.sect !== this.props.sect) ||
				(this.props.party !== 'All' && legislator.party !== this.props.party)) {
				return ;
			}
			rows.push(Card( {legislator:legislator} ))
		}.bind(this));
		return (
			React.DOM.div( {className:"list"}, 
			 rows
			)
		);
	}
});

var SearchBar = React.createClass({displayName: 'SearchBar',
	handleChange: function() {
		this.props.onUserInput(this.refs.filterTextInput.getDOMNode().value);
	},
	render: function() {
		return (
			React.DOM.form( {className:"searchBar"}, 
				React.DOM.input( {type:"text", id:"search", placeholder:"Search...", value:this.props.filterText, 
					onChange:this.handleChange,
					ref:"filterTextInput"} )
			)
		)
	}

});

var FilterBar = React.createClass({displayName: 'FilterBar',
	handleChange: function() {
		this.props.onUserInput(
			this.refs.districtInput.getDOMNode().value,
			this.refs.sectInput.getDOMNode().value,
			this.refs.partyInput.getDOMNode().value
		);
	},
	render: function() {
		var districts = [];
		var sects = [];
		var parties = [];
		console.log(this.props)
		this.props.legislators.forEach(function(legislator) {
			if  ((this.props.district !== 'All' && legislator.district !== this.props.district) ||
				(this.props.sect !== 'All' && legislator.sect !== this.props.sect) ||
				(this.props.party !== 'All' && legislator.party !== this.props.party)) {
				return;
			}
			if (districts.indexOf(legislator.district) === -1) {
				districts.push(legislator.district)
			}
			if (sects.indexOf(legislator.sect) === -1) {
				sects.push(legislator.sect)
			}
			if (parties.indexOf(legislator.party) === -1) {
				parties.push(legislator.party)
			}
		}.bind(this))
		var districtOptions = districts.map(function(district) {
			return React.DOM.option( {value:district}, district)
		})
		var partyOptions = parties.map(function(party) {
			return React.DOM.option( {value:party}, party)
		})
		var sectOptions = sects.map(function(sect) {
			return React.DOM.option( {value:sect}, sect)
		})
		return (
			React.DOM.form( {className:"filterBar"}, 
			React.DOM.div( {className:"selector"}, 
			React.DOM.span(null, "Sect:  "  ),
			React.DOM.select( {ref:"sectInput", value:this.props.sect, onChange:this.handleChange}, 
				React.DOM.option( {value:"All"}, "All"),
				sectOptions
			)
			),
			React.DOM.div( {className:"selector"}, 
			React.DOM.span(null, "Party:  "  ),
			React.DOM.select( {ref:"partyInput", value:this.props.party, onChange:this.handleChange}, 
				React.DOM.option( {value:"All"}, "All"),
				partyOptions
			)
			),
			React.DOM.div( {className:"selector"}, 
			React.DOM.span(null, "District:  "  ),
			React.DOM.select( {ref:"districtInput", value:this.props.district, onChange:this.handleChange}, 
				React.DOM.option( {value:"All"}, "All"),
				districtOptions
			)
			)
			)
		)
	}
})


var FilterableTable = React.createClass({displayName: 'FilterableTable',
	handleNewData: function(data) {
		this.setState({
			legislators: data,
		});
	},
	componentWillMount: function() {
		var that = this;
		$("#img").show();
		$.ajax({
			url: this.props.url,
			dataType: 'json',
		})
		.done(function(data) {
			that.handleNewData(data);
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			$("#img").hide();
			console.log("complete");
		});
		
	},
	getInitialState: function() {
		return {
			legislators: [],
			filterText: '',
			district: 'All',
			sect: 'All',
			party: 'All',
		};
	},
	handleSearchInput: function(filterText) {
		this.setState({
			filterText: filterText,
		});
	},
	handleFilterInput: function(district, sect, party) {
		this.setState({
			district: district,
			sect: sect,
			party: party
		});
	},
	render: function() {
		return (
			React.DOM.div(null, 
				SearchBar( {onUserInput:this.handleSearchInput, filterText:this.state.filterText} ),
				FilterBar( 
					{onUserInput:this.handleFilterInput,
					legislators:this.state.legislators,
					district:this.state.district,
					sect:this.state.sect,
					party:this.state.party} ),
				Table( 
					{legislators:this.state.legislators, 
					filterText:this.state.filterText,
					district:this.state.district,
					sect:this.state.sect,
					party:this.state.party} )
			)
		);
	}
})

React.renderComponent(
	FilterableTable( {url:"http://api.nouwweb.pw/search?deputies_terms=2009"} ),
	document.getElementById('content')
);
}());