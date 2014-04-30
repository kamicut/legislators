(function() {
'use strict';
var Card = React.createClass({
	render: function() {
		var legislator = this.props.legislator;
		var email = legislator.email.trim().length > 0?
			<a href={'mailto:'+legislator.email.trim()}>Email</a> :
			''

		var twitter = legislator.twitter.trim().length > 0?
			<a href={legislator.twitter}>Twitter</a> : 
			''

		var facebook = legislator.facebook.trim().length > 0?
			<a href={legislator.facebook}>Facebook</a> : 
			''

		var anySocial = (facebook + twitter + email).length == 0?
			"Not Available" : ""

		return (
			<div className="card">
				<h3>{legislator.first_name + " " + legislator.last_name}</h3>
				<ul>
					<li><strong>District:</strong> {legislator.district || "Not Available"}</li>
					<li><strong>Sect: </strong>{legislator.sect || "Not Available"}</li>
					<li><strong>Party: </strong> {legislator.party || "Not Available"}</li>
					<li><strong>Phone: </strong> {legislator.phone || "Not Available"}</li>
					<li><strong>Mobile: </strong> {legislator.mobile || "Not Available"}</li>
					<li><strong>Social: </strong> {anySocial}
				<span>{email} {twitter} {facebook}</span></li>
				</ul>
			</div>
		);
	}
});

var Table = React.createClass({
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
			rows.push(<Card legislator={legislator} />)
		}.bind(this));
		return (
			<div className="list">
			 {rows}
			</div>
		);
	}
});

var SearchBar = React.createClass({
	handleChange: function() {
		this.props.onUserInput(this.refs.filterTextInput.getDOMNode().value);
	},
	render: function() {
		return (
			<form className="searchBar">
				<input type="text" id="search" placeholder="Search..." value={this.props.filterText} 
					onChange={this.handleChange}
					ref="filterTextInput" />
			</form>
		)
	}

});

var FilterBar = React.createClass({
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
			return <option value={district}>{district}</option>
		})
		var partyOptions = parties.map(function(party) {
			return <option value={party}>{party}</option>
		})
		var sectOptions = sects.map(function(sect) {
			return <option value={sect}>{sect}</option>
		})
		return (
			<form className="filterBar">
			<div className="selector">
			<span>Sect:  </span>
			<select ref="sectInput" value={this.props.sect} onChange={this.handleChange}>
				<option value='All'>All</option>
				{sectOptions}
			</select>
			</div >
			<div className="selector">
			<span>Party:  </span>
			<select ref="partyInput" value={this.props.party} onChange={this.handleChange}>
				<option value='All'>All</option>
				{partyOptions}
			</select>
			</div>
			<div className="selector">
			<span>District:  </span>
			<select ref="districtInput" value={this.props.district} onChange={this.handleChange}>
				<option value='All'>All</option>
				{districtOptions}
			</select>
			</div>
			</form>
		)
	}
})


var FilterableTable = React.createClass({
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
			<div>
				<SearchBar onUserInput={this.handleSearchInput} filterText={this.state.filterText} />
				<FilterBar 
					onUserInput={this.handleFilterInput}
					legislators={this.state.legislators}
					district={this.state.district}
					sect={this.state.sect}
					party={this.state.party} />
				<Table 
					legislators={this.state.legislators} 
					filterText={this.state.filterText}
					district={this.state.district}
					sect={this.state.sect}
					party={this.state.party} />
			</div>
		);
	}
})

React.renderComponent(
	<FilterableTable url="http://api.nouwweb.pw/search?deputies_terms=2009" />,
	document.getElementById('content')
);
}());