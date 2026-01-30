#include <bits/stdc++.h>
int factorial(int n, int r )
{
    int ans= 1; 
    int   x=n-r;
    if(n==0 or r==0 ) return 1; 
    for(int i =n ; i>x; i--)
    {
        ans*= i;
    }
    return ans;
}
using namespace std;

int main() {
    int n , r;
    cin>>n>>r ;
	cout<<factorial(n ,r);
}
