#include <bits/stdc++.h>
int factorial(int n )
{
    int ans= 1; 
    for(int i =1 ; i<=n; i++)
    {
        ans*= i;
    }
    return ans;
}
using namespace std;

int main() {
    int n , r;
    cin>>n>>r ;
  int nfact=   factorial(n) ;
    int rfact = factorial(r);
    
    int nrfact = factorial(n-r);
    cout<<nrfact;

}
