# The Beaten Path

Using Utah hiking trails registered with the National Forest Service, this hiking app allows you to search for trails based on length, time to complete, location and difficulty with an interactive map. You can also build a profile page with trails that you have favorited and trails you have completed.

### Tech Used
 HTML/CSS  •  AngularJS  •  Node.js  •  Express  •  PostgreSQL  •  Charts.js  •  Mapbox-gl.js  •  Auth0

![1](/readme-images/home-page.png)



The interactive map below lists the trails in the left column that are only within the current bounds of the map. If the map is moved, the trails will update in real time to reflect new trails showing within the map bounds.

There is also a cluster feature where trails that are close in location will cluster to a number. When that number is clicked, the map zooms in so that the trails can separate from the cluster. This can be repeated until there are no more clusters.

When a user hovers on a trail name from the left column, a popup with the trail name will show above the marker on the map associated with the trail. The user can also hover over the map markers to get the name of the trail.

![2](/readme-images/trails-map.png)



This advanced search feature allows a user to search for trails with specific queries. One option may be selected or all may be selected. When finished and search is pressed, it will return to the interactive map which is updated according to the search parameters. Only trails that fit within those parameters will appear on the map. There is also an option to reset your search parameters so it will once again show all the trails.

![3](/readme-images/trail-search.png)



To see more information about a trail, the user can click on the name of the trail to open to a new view. This view will show the trail polyline on the map along with the trailhead with the map marker. Stats on the specific trail are shown that were calculated from various algorithms using only the latitude/longitude points of the trail. 

If the user has an account and is logged in, they can add this trail to their favorites list which will display in their profile page. If the trail has been hiked by the user, they can mark it as completed. These completed trails are stored and displayed in a graph in the profile page showing the cumulative feet in elevation and the cumulative miles in distance hiked.  

A link to Google Maps with directions to the trailhead is available.

![4](/readme-images/trail-data.png)



To give the user a better idea of what the hike will be like, an elevation map can be expanded. This was created by converting the latitude/longitude coordinates of the trail into an encoded polyline and then sent to Google's elevation API. The data received was the elevation of each latitude/longitude point from the encoded polyline. That data is then displayed in the elevation map.

![5](/readme-images/elevation-map.png)



The user can create a profile by signing up through Auth0. Any trails added to their favorite list will show on their profile. There is an option to remove from the user's favorite list, mark completed or view the trail data page for the specific trail. 

![6](/readme-images/profile-page.png)



