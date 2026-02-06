#include<bits/stdc++.h>
using namespace std; 
int main()
{
    int N ,X ; 
    cin>>N>>X;
    vector<long long>a(N); 
    for(int i =0 ;i<N ; i++)
    {
        cin>>a[i]; 
    }
    for(int i=0; i<N ; i++){
        if(a[i] == X)
        {
            cout<<"YES";
            return 0;
        }
    }
    cout<<"NO";
    return 0;
}