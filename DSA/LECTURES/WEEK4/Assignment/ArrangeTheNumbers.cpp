#include<bits/stdc++.h>
using namespace std;
int main()
{
    int t ;
    cin>>t;
    while(t--)
    {

        int n ;
    cin >>n; 
    vector<int>odd; 
    vector<int>even;
    for (int i =1 ;i<=n;  i++)
    {
        if(i%2==0) even.push_back(i) ;
        else odd.push_back(i);
    }
    for(int i =0 ;i<odd.size(); i++)
    {
        cout<<odd[i]<<" ";
    }
    for(int i=even.size()-1 ; i>=0; i--)
    {
        cout<<even[i]<<" ";
    }
    cout<<endl;
    }
    
    return 0;
} 