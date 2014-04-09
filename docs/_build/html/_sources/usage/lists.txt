Lists 
========

There are currently three endpoints that will return a list

``/names``
----------
Returns the list of names of the 2009 legislators in English and in Arabic. 

``/districts``
--------------
Returns the list of districts and the number of legislators in that district. 

``/parties``
------------
Returns the list of political parties and the number of legislators of that party. 
Some parliamentary members belong to two parties. The list will account for that by creating a duplicate listing 
that includes both parties. 

.. code-block:: none

	Legislator belongs to A and B then the list will be:
	- A
	- B
	- A,B
	- ...