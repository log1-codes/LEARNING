#include<bits/stdc++.h>
using namespace std; 
int main()
{
    int n , m;
    cin>>n>>m; 
    for(int i=0 ;i<n; i++)
    {
        int rowMin = INT_MAX; 
        for(int  j =0 ;j<m ; j++)
        {
            int value ;
            cin>>value;
            rowMin = min(rowMin , value);
        }
        cout<<rowMin<< " ";
    }
    return 0;
}